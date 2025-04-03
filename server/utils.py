import json
import pickle
import numpy as np

_locations = None
_data_columns = None
_model = None


def estimate_price(location, sqft, bhk, bath):
    try:
        loc_index = _data_columns.index(location.lower())
    except:
        loc_index = -1

    x = np.zeros(len(_data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    return round(_model.predict([x])[0], 2)


def load_saved_artifacts():
    print("Loading artifacts...")

    global _locations
    global _data_columns

    with open("./artifacts/columns.json", "r") as f:
        _data_columns = json.load(f)['data_columns']
        _locations = _data_columns[3:]

    global _model
    if _model is None:
        with open("./artifacts/bangalore_pricing_model.pkl", "rb") as f:
            _model = pickle.load(f)

    print("Artifacts loaded")


def get_locations():
    return _locations


def get_data_columns():
    return _data_columns


if __name__ == '__main__':
    load_saved_artifacts()
    print(get_locations()[0])
    print(estimate_price('1st Phase JP Nagar', 1000, 3, 3))
