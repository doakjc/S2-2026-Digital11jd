import requests

barcode = input("Barcode: ")
url = f"https://world.openfoodfacts.net/api/v2/product/{barcode}"

response = requests.get(url)
print(response.json())

response = response.json()

print(f"Product Name: {response["product"]["product_name"]}")