import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
import joblib

# ---------------------------
# 🔹 Paths (update if needed)
# ---------------------------
DATA_PATH = r"D:\Machine-Learning-Projects\Ai_Medbot\ml_training\data\data.xlsx"
MODEL_PATH = r"D:\Machine-Learning-Projects\Ai_Medbot\ml_training\model\model.pkl"

# ---------------------------
# 🔗 Load dataset
# ---------------------------
print(f"Loading dataset from: {DATA_PATH}")
try:
    data = pd.read_excel(DATA_PATH)
    print("✅ Excel file loaded successfully.")
except FileNotFoundError:
    print("❌ Excel file not found. Please check the DATA_PATH.")
    raise

# ---------------------------
# 🧠 Identify label column
# ---------------------------
label_col = "disease" if "disease" in data.columns else data.columns[-1]
print(f"Using '{label_col}' as the target column.")

# ---------------------------
# 📊 Split features and target
# ---------------------------
X = data.drop(columns=[label_col])
y = data[label_col]

# ---------------------------
# 🏋️‍♂️ Train-test split
# ---------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ---------------------------
# 🌲 Train model
# ---------------------------
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)

# ---------------------------
# 📈 Evaluate model
# ---------------------------
accuracy = model.score(X_test, y_test)
print(f"✅ Model trained. Test Accuracy: {accuracy:.2%}")

# ---------------------------
# 💾 Save model
# ---------------------------
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
joblib.dump(model, MODEL_PATH)
print(f"✅ Model saved at: {MODEL_PATH}")
"""medbot package placeholder
This package provides lightweight configuration values used by the training notebooks.
Adjust paths in `config.py` to match your local dataset/model locations."""