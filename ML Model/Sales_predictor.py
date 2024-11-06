import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import matplotlib.pyplot as plt

# Load the training dataset
train_data = pd.read_csv('sales_data2.csv')

# Convert 'date' column to datetime format specifying the correct format
train_data['date'] = pd.to_datetime(train_data['date'], format='mixed')

# One-hot encoding for categorical variables
encoder = OneHotEncoder(sparse_output=False, drop='first')
encoded_cats = encoder.fit_transform(train_data[['state', 'item category', 'festival']])

# Create a DataFrame for the encoded categorical variables
encoded_cats_df = pd.DataFrame(encoded_cats, columns=encoder.get_feature_names_out(['state', 'item category','festival']))

# Concatenate the encoded features with the original data
train_data = pd.concat([train_data, encoded_cats_df], axis=1)

# Feature Engineering: Creating a supervised learning problem
train_data['sales_diff'] = train_data['sales'].diff()
train_data.dropna(inplace=True)  # Drop rows with NaN values

def create_supervised(df, lag=1):
    columns = [df.shift(i) for i in range(1, lag+1)]
    columns.append(df)
    df_supervised = pd.concat(columns, axis=1)
    df_supervised.fillna(0, inplace=True)
    return df_supervised

# Select relevant columns for supervised learning
relevant_columns = ['sales_diff'] + list(encoded_cats_df.columns)
supervised_data = create_supervised(train_data[relevant_columns], 12)

# Splitting data into features and target
X_train = supervised_data.iloc[:, 1:]
y_train = supervised_data.iloc[:, 0].values.reshape(-1, 1)

# Scaling features
scaler_X = MinMaxScaler(feature_range=(-1, 1))
scaler_y = MinMaxScaler(feature_range=(-1, 1))

scaler_X.fit(X_train)
scaler_y.fit(y_train)

X_train_scaled = scaler_X.transform(X_train)
y_train_scaled = scaler_y.transform(y_train)

# Train the Linear Regression model
lr_model = LinearRegression()
lr_model.fit(X_train_scaled, y_train_scaled)

# Load the test dataset
test_data = pd.read_csv('test_data2.csv')

# Convert 'date' column to datetime format specifying the correct format
test_data['date'] = pd.to_datetime(test_data['date'], format='mixed')

test_data.sort_values('date', inplace=True)

# One-hot encoding for categorical variables
encoded_cats_test = encoder.transform(test_data[['state', 'item category','festival']])

# Create a DataFrame for the encoded categorical variables
encoded_cats_test_df = pd.DataFrame(encoded_cats_test, columns=encoder.get_feature_names_out(['state', 'item category','festival']))

# Concatenate the encoded features with the original data
test_data = pd.concat([test_data, encoded_cats_test_df], axis=1)

# Feature Engineering: Creating a supervised learning problem
test_data['sales_diff'] = test_data['sales'].diff()
test_data.dropna(inplace=True)  # Drop rows with NaN values

# Select relevant columns for supervised learning
supervised_test_data = create_supervised(test_data[relevant_columns], 12)

# Splitting data into features and target
X_test = supervised_test_data.iloc[:, 1:]
y_test = supervised_test_data.iloc[:, 0].values.reshape(-1, 1)

X_test_scaled = scaler_X.transform(X_test)
y_test_scaled = scaler_y.transform(y_test)

# Predict using the trained model
lr_predict_scaled = lr_model.predict(X_test_scaled)

# Inverse transform to original scale
lr_predict = scaler_y.inverse_transform(lr_predict_scaled)

# Calculating predicted sales
result_list = [lr_predict[i][0] + y_test[i][0] for i in range(len(lr_predict))]

# Creating a DataFrame for predictions
predict_df = pd.DataFrame({
    'date': test_data['date'].reset_index(drop=True),
    'linear_prediction': result_list
})

# Model Evaluation
lr_mse = np.sqrt(mean_squared_error(y_test, lr_predict))
lr_mae = mean_absolute_error(y_test, lr_predict)
lr_r2 = r2_score(y_test, lr_predict)

print(f"Linear Regression MSE: {lr_mse}")
print(f"Linear Regression MAE: {lr_mae}")
print(f"Linear Regression R2 Score: {lr_r2}")

# Plotting actual sales vs predicted sales for the test data
plt.figure(figsize=(15, 5))
plt.plot(test_data['date'], y_test, label='Actual Sales')
plt.plot(predict_df['date'], predict_df['linear_prediction'], label='Predicted Sales', linestyle='--')
plt.title('Actual Sales vs Predicted Sales')
plt.xlabel('Date')
plt.ylabel('Sales')
plt.legend()
plt.show()
