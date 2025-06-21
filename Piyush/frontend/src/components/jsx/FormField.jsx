import styles from '../css/FormField.module.css';

function FormField({ label, type, name, value, onChange, placeholder }) {
  return (
    <div className={styles.group}>
      <label className={styles.label} htmlFor={name}>{label}</label>
      <input
        className={styles.input}
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default FormField;