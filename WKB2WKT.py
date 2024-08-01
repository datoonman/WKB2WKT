import pandas as pd
from shapely import wkb

# Load the CSV file
input_file = '1297DA70-CSV.csv'
output_file = input_file.replace('.csv', '_wkt.csv')

# Read the CSV file
df = pd.read_csv(input_file)

# Print the column names to verify the exact column name
print("Column names:", df.columns)

# Function to convert WKB to WKT
def wkb_to_wkt(wkb_hex):
    if pd.isna(wkb_hex):
        return None
    try:
        wkb_bytes = bytes.fromhex(wkb_hex)
        geometry = wkb.loads(wkb_bytes)
        return geometry.wkt
    except Exception as e:
        print(f"Error converting WKB to WKT: {e}")
        return None

# Update with the correct column name containing WKB data
wkb_column_name = 'farmshape'  # Replace with the correct column name

if wkb_column_name not in df.columns:
    print(f"Error: Column '{wkb_column_name}' not found in the CSV file.")
else:
    # Apply the conversion function to the entire WKB column
    df[wkb_column_name] = df[wkb_column_name].apply(wkb_to_wkt)

    # Save the new DataFrame to a new CSV file
    df.to_csv(output_file, index=False)

    print(f"Converted CSV file saved as {output_file}")
