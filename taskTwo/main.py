import requests

# barcode = input("Barcode: ")
barcode = 3017624010701
url = f"https://world.openfoodfacts.net/api/v2/product/{barcode}"

response = requests.get(url)
# print(response.json())

response = response.json()

product_name = (response["product"]["product_name"]) if (response["product"]["product_name"]) != "" else "n/a"
print(f"Product Name: {product_name}")

is_water = response["product"]["nutriscore_data"]["is_water"]
water_check = { 0:"not ",1:""}

print(f"This product is {water_check[is_water]}water.")

def main():
    opt = input("Select an item")