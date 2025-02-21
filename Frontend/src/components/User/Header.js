import styles from "./Header.module.css"

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className={styles.header}>
      <h1>User Dashboard</h1>
      <button className={styles.toggleButton} onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  )
}

export default Header

