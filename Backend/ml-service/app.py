from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import os
import logging
from price_model import load_model, predict_rental_price, build_and_train_model, save_model

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for model, scaler, and feature names
model = None
scaler = None
feature_names = None

def load_or_train_model():
    """
    Load the model if it exists, or train a new one if it doesn't
    """
    global model, scaler, feature_names
    
    model_path = 'model'
    scaler_path = 'scaler.pkl'
    features_path = 'features.pkl'
    
    if os.path.exists(model_path) and os.path.exists(scaler_path) and os.path.exists(features_path):
        logger.info("Loading existing model...")
        model, scaler, feature_names = load_model(model_path, scaler_path, features_path)
    else:
        logger.info("Training new model...")
        model, scaler, feature_names = build_and_train_model()
        save_model(model, scaler, feature_names)
    
    logger.info("Model ready!")

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint to predict the rental price of a car in Sri Lanka
    
    Expected JSON payload:
    {
        "brand": "Ferrari",
        "year": 2022,
        "occasion": "Wedding",
        "duration_days": 1,
        "current_price": 150000
    }
    
    Returns:
    JSON with predicted price and market analysis
    """
    try:
        data = request.json
        logger.info(f"Received prediction request: {data}")
        
        # Extract rental features
        rental_features = {
            'brand': data['brand'],
            'year': data['year'],
            'occasion': data['occasion'],
            'duration_days': data.get('duration_days', 1)  # Default to 1 day if not provided
        }
        
        # Get the current price
        current_price = float(data['current_price'])
        
        # Predict the price
        predicted_price = predict_rental_price(model, scaler, feature_names, rental_features)
        
        # Calculate the difference percentage
        diff_percentage = ((predicted_price - current_price) / current_price) * 100
        
        # Determine if the rental is underpriced, overpriced, or fairly priced
        if diff_percentage > 8:
            market_status = "underpriced"
            analysis = f"This rental appears to be priced below the estimated market value for {data['occasion']} events in Sri Lanka."
        elif diff_percentage < -8:
            market_status = "overpriced"
            analysis = f"This rental appears to be priced above the estimated market value for {data['occasion']} events in Sri Lanka."
        else:
            market_status = "fair"
            analysis = f"This rental is priced fairly according to the current market for {data['occasion']} events in Sri Lanka."
        
        # Prepare the response
        response = {
            'current_price': current_price,
            'predicted_price': round(predicted_price, 2),
            'diff_percentage': round(diff_percentage, 2),
            'market_status': market_status,
            'analysis': analysis,
            'occasion': data['occasion'],
            'duration_days': rental_features['duration_days'],
            'currency': 'LKR'
        }
        
        logger.info(f"Prediction result: {response}")
        
        return jsonify(response)
    
    except Exception as e:
        logger.error(f"Error making prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """
    Endpoint to check if the service is running
    """
    return jsonify({'status': 'healthy', 'message': 'ML Rental Price Prediction Service is running'}), 200

@app.route('/retrain', methods=['POST'])
def retrain():
    """
    Endpoint to retrain the model
    """
    try:
        global model, scaler, feature_names
        
        logger.info("Retraining model...")
        model, scaler, feature_names = build_and_train_model()
        save_model(model, scaler, feature_names)
        
        return jsonify({'status': 'success', 'message': 'Model retrained successfully'}), 200
    
    except Exception as e:
        logger.error(f"Error retraining model: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Initialize the model when the app starts
@app.before_first_request
def initialize():
    load_or_train_model()

if __name__ == '__main__':
    # Load the model now if running directly
    load_or_train_model()
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5001, debug=True)

