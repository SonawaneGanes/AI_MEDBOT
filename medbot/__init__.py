"""medbot package placeholder

This package provides lightweight configuration values used by the training notebooks.
Adjust paths in `config.py` to match your local dataset/model locations.
"""

import importlib.util

config_path = r"D:\Machine-Learning-Projects\Ai_Medbot\medbot\config.py"
spec = importlib.util.spec_from_file_location("config", config_path)
config = importlib.util.module_from_spec(spec)
spec.loader.exec_module(config)

DATA_PATH = config.DATA_PATH
MODEL_PATH = config.MODEL_PATH



__all__ = ["config"]
