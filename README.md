🩺 AI Doctor Chatbot – Model Training Pipeline
This project trains a machine learning model to assist an AI-powered medical chatbot in predicting diseases based on user symptoms. 
The model is built using a Decision Tree classifier and trained on a structured medical dataset. 
It is designed to integrate seamlessly with a frontend chatbot and backend API.

AI_MEDBOT/
├── .bolt/                          # Supabase Edge Function metadata
├── node_modules/                   # Node.js dependencies
├── public/                         # Static assets for frontend
├── src/                            # React frontend (Vite + TypeScript)
│   ├── components/                 # Chatbot UI components
│   ├── pages/                      # Route-based views
│   ├── assets/                     # Images, icons, etc.
│   ├── utils/                      # API calls, helpers
│   └── App.tsx                     # Main app entry
├── supabase/                       # Supabase backend integration
│   ├── functions/                  # Supabase Edge Functions
│   │   └── chatbot.ts              # GPT + ML proxy handler
│   └── supabase.config.ts          # Supabase client setup
├── ml_training/                    # ML model training pipeline
│   ├── data/                       # Excel/CSV training datasets
│   │   └── Heart_disease_statlog.xlsx
│   ├── models/                     # Saved model files (.pkl)
│   │   └── medbot_model.pkl
│   ├── medbot/                     # Configuration module
│   │   └── config.py               # Paths for data/model
│   ├── api/                        # Optional Flask/FastAPI backend
│   │   └── serve_model.py          # ML prediction API
│   └── train_model.ipynb           # Jupyter Notebook for training
├── .env                            # Environment variables
├── .gitignore                      # Git exclusions
├── package.json                    # Node.js project metadata
├── package-lock.json               # Dependency lock file
├── tailwind.config.js              # Tailwind CSS config
├── postcss.config.js               # PostCSS config
├── tsconfig.json                   # TypeScript config
├── tsconfig.app.json               # App-specific TS config
├── tsconfig.node.json              # Node-specific TS config
├── vite.config.ts                  # Vite build config
└── README.md                       # Project overview and instructions

🧠 Why This Structure Works
- 🔁 Modular: separates frontend, backend, ML, and config
- 🧪 Testable: supports local model testing and API calls
- 🚀 Deployable: ready for Supabase, Vercel, or Railway
- 📊 Scalable: easy to add new datasets, models, or endpoints

Let me know if you want to add:
- ✅ Docker setup for backend
- ✅ Model versioning and logging
- ✅ Supabase database schema for storing user queries or predictions
You’re building a production-grade AI system — this structure sets you up for success.
