import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import os

# Define the model building and training function
def build_and_train_model(data_path='rental_data.csv'):
    """
    Build and train a rental price prediction model for luxury cars in Sri Lanka
    
    Parameters:
    data_path (str): Path to the CSV file containing rental data
    
    Returns:
    tuple: (trained model, scaler object)
    """
    # Load the data
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
    else:
        # Create sample data if file doesn't exist
        print(f"Data file {data_path} not found. Creating sample data...")
        np.random.seed(42)
        n_samples = 500
        
        brands = ['Mercedes-Benz', 'BMW', 'Audi', 'Lamborghini', 'Ferrari', 'Porsche', 
                  'Bentley', 'Rolls-Royce', 'Aston Martin', 'Maserati']
        
        occasions = ['Wedding', 'Corporate Event', 'Prom', 'Photoshoot', 
                     'Music Video', 'Anniversary', 'Birthday', 'Graduation']
        
        years = np.random.randint(2010, 2024, n_samples)
        duration_days = np.random.randint(1, 8, n_samples)
        brand_idx = np.random.randint(0, len(brands), n_samples)
        occasion_idx = np.random.randint(0, len(occasions), n_samples)
        
        # Base rental prices for different brands in Sri Lankan Rupees (LKR)
        # Adjusted to match Sri Lankan market rates (25,000 - 200,000 LKR per day)
        brand_base_prices = {
            'Mercedes-Benz': 45000, 
            'BMW': 40000, 
            'Audi': 35000, 
            'Lamborghini': 180000, 
            'Ferrari': 200000, 
            'Porsche': 90000, 
            'Bentley': 150000, 
            'Rolls-Royce': 180000, 
            'Aston Martin': 120000, 
            'Maserati': 100000
        }
        
        # Occasion multipliers (some occasions command premium prices)
        occasion_multipliers = {
            'Wedding': 1.3, 
            'Corporate Event': 1.15, 
            'Prom': 1.2, 
            'Photoshoot': 1.1,
            'Music Video': 1.25, 
            'Anniversary': 1.1, 
            'Birthday': 1.05, 
            'Graduation': 1.15
        }
        
        # Generate rental prices with some randomness based on brand, year, and occasion
        prices = []
        for i in range(n_samples):
            brand = brands[brand_idx[i]]
            occasion = occasions[occasion_idx[i]]
            base_price = brand_base_prices[brand]
            year_factor = (years[i] - 2010) * 1000  # newer cars cost more
            occasion_factor = occasion_multipliers[occasion]
            random_factor = np.random.normal(0, 5000)  # random noise
            
            # Calculate daily price
            daily_price = (base_price + year_factor) * occasion_factor + random_factor
            
            # Ensure minimum price based on brand and maximum price cap
            daily_price = max(daily_price, brand_base_prices[brand] * 0.8)
            daily_price = min(daily_price, 200000)  # Cap at 200,000 LKR
            
            prices.append(daily_price)
        
        df = pd.DataFrame({
            'brand': [brands[i] for i in brand_idx],
            'year': years,
            'occasion': [occasions[i] for i in occasion_idx],
            'duration_days': duration_days,
            'daily_price': prices
        })
        
        # Save the sample data
        df.to_csv(data_path, index=False)
    
    # Preprocess the data
    # Create one-hot encoding for categorical variables
    df_encoded = pd.get_dummies(df, columns=['brand', 'occasion'], drop_first=False)
    
    # Split features and target
    X = df_encoded.drop('daily_price', axis=1)
    y = df_encoded['daily_price']
    
    # Split data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Build the model
    model = keras.Sequential([
        keras.layers.Dense(64, activation='relu', input_shape=(X_train_scaled.shape[1],)),
        keras.layers.Dropout(0.2),
        keras.layers.Dense(32, activation='relu'),
        keras.layers.Dropout(0.2),
        keras.layers.Dense(16, activation='relu'),
        keras.layers.Dense(1)
    ])
    
    # Compile the model
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    
    # Train the model
    history = model.fit(
        X_train_scaled, y_train,
        epochs=50,
        batch_size=32,
        validation_split=0.2,
        verbose=1,
        callbacks=[
            keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True)
        ]
    )
    
    # Evaluate the model
    loss, mae = model.evaluate(X_test_scaled, y_test, verbose=0)
    print(f"Test Mean Absolute Error: LKR {mae:.2f} per day")
    
    return model, scaler, list(df_encoded.columns.drop('daily_price'))

def save_model(model, scaler, feature_names, model_path='model', scaler_path='scaler.pkl', features_path='features.pkl'):
    """
    Save the trained model and scaler
    
    Parameters:
    model: Trained Keras model
    scaler: Fitted StandardScaler
    feature_names: List of feature names
    model_path: Directory path to save the model
    scaler_path: Path to save the scaler
    features_path: Path to save the feature names
    """
    # Save the model
    model.save(model_path)
    
    # Save the scaler
    joblib.dump(scaler, scaler_path)
    
    # Save the feature names
    joblib.dump(feature_names, features_path)
    
    print(f"Model saved to {model_path}")
    print(f"Scaler saved to {scaler_path}")
    print(f"Feature names saved to {features_path}")

def load_model(model_path='model', scaler_path='scaler.pkl', features_path='features.pkl'):
    """
    Load the trained model and scaler
    
    Parameters:
    model_path: Directory path to load the model from
    scaler_path: Path to load the scaler from
    features_path: Path to load the feature names from
    
    Returns:
    tuple: (loaded model, loaded scaler, feature names)
    """
    # Load the model
    model = keras.models.load_model(model_path)
    
    # Load the scaler
    scaler = joblib.load(scaler_path)
    
    # Load the feature names
    feature_names = joblib.load(features_path)
    
    return model, scaler, feature_names

def predict_rental_price(model, scaler, feature_names, rental_data):
    """
    Predict the rental price for a car in Sri Lanka
    
    Parameters:
    model: Trained Keras model
    scaler: Fitted StandardScaler
    feature_names: List of feature names
    rental_data: Dictionary with rental features (brand, year, occasion, duration_days)
    
    Returns:
    float: Predicted daily rental price in LKR
    """
    # Create a DataFrame with the rental data
    df = pd.DataFrame([rental_data])
    
    # One-hot encode the categorical variables
    df_encoded = pd.get_dummies(df, columns=['brand', 'occasion'], drop_first=False)
    
    # Ensure all features are present
    for feature in feature_names:
        if feature not in df_encoded.columns:
            df_encoded[feature] = 0
    
    # Select only the features used by the model and in the correct order
    df_encoded = df_encoded[feature_names]
    
    # Scale the features
    scaled_data = scaler.transform(df_encoded)
    
    # Make prediction
    predicted_price = model.predict(scaled_data)[0][0]
    
    return predicted_price

# If this file is run directly, train and save the model
if __name__ == "__main__":
    # Build and train the model
    model, scaler, feature_names = build_and_train_model()
    
    # Save the model and scaler
    save_model(model, scaler, feature_names)
    
    # Test prediction with a sample rental
    sample_rental = {
        'brand': 'Ferrari',
        'year': 2022,
        'occasion': 'Wedding',
        'duration_days': 1
    }
    
    # Load the model and make a prediction
    loaded_model, loaded_scaler, loaded_features = load_model()
    predicted_price = predict_rental_price(loaded_model, loaded_scaler, loaded_features, sample_rental)
    
    print(f"Predicted daily rental price for the sample: LKR {predicted_price:.2f}")

