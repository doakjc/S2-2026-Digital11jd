import requests

def get_recommendation(grade, sugars, carbs, proteins):
    output = ""
    if grade is not None:
        grade = grade.upper()
        if grade == "A":
            output += "Nutri-Score A: Healthy choice!\n"
        elif grade == "B":
            output += "Nutri-Score B: Good choice.\n"
        elif grade == "C":
            output += "Nutri-Score C: Okay in moderation.\n"
        elif grade == "D":
            output += "Nutri-Score D: Limit your intake.\n"
        elif grade == "E":
            output += "Nutri-Score E: Consume in moderation.\n"
    else:
        output += "No Nutri-Score available.\n"

    if sugars is not None:
        if sugars <= 5:
            output += f"Low sugar ({sugars}g/100g): Healthy choice!\n"
        elif sugars <= 22.5:
            output += f"Moderate sugar ({sugars}g/100g): Okay in moderation.\n"
        else:
            output += f"High sugar ({sugars}g/100g): Consume in moderation.\n"
    else: 
        output += "No sugar data available.\n"

    if carbs is not None:
        if carbs <= 10:
                output += f"Low carbohydrates ({carbs}g/100g): Healthy choice!\n"
        elif sugars <= 40:
            output += f"Moderate cabohydrates ({carbs}g/100g): Okay in moderation.\n"
        else:
            output += f"High carbohydrates ({carbs}g/100g): Consume in moderation.\n"
    else: 
            output += "No cabohydrates data available.\n" 

    if proteins is not None:
            if proteins <= 10:
                    output += f"Low protein level. ({proteins}g/100g)\n"
            elif proteins <= 25:
                output += f"Moderate protein level. ({proteins}g/100g)\n"
            else:
                output += f"High in protein! ({proteins}g/100g)\n"
    else: 
        output += "No protein data available.\n" 
        
    return output

def call_food_data(product_name, ingredients, nutriscore, sugar, carbohydrates, protein):
    print(f"\nProduct Name: {product_name}")
    print(f"Ingredients: {ingredients}")
    print(get_recommendation(nutriscore, sugar, carbohydrates, protein))

def print_menu():
    print("1. Set Barcode")
    print("2. View Product Information")
    print("3. View Stored Products")
    print("4. Exit")

def main():
    products = {3033710065967:"NESQUIK Cacao"}
    barcode = 3033710065967
    while True:
        print_menu()
        choice = input("Enter your choice: ")
        if choice == "1":
            while True:
                barcode = input("Enter a Barcode Number (or enter E to exit): ")
                if barcode.upper() == "E":
                    break
                else:
                    url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}"
                    headers = {"User-Agent": "MyBarcodeApp/1.0/doakjc@pedarecc.sa.edu.au"}
                    response = requests.get(url, headers=headers)
                    data = response.json()
                    print(data.get("status"))
                    if data.get("status") == 1:
                        print(f"Valid Barcode Number!\n Current Barcode set to {barcode}\n")
                        products[barcode] = data.get("product", {}).get("product_name", "Product name not found")
                        break
                    else:
                        print("Invalid Barcode Number")
            
        elif choice == "2":
            url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}"
            headers = {"User-Agent": "MyBarcodeApp/1.0/doakjc@pedarecc.sa.edu.au"}
            response = requests.get(url, headers=headers)
            data = response.json()
            product_name = data.get("product", {}).get("product_name", "Product name not found")
            ingredients = data.get("product", {}).get("ingredients_text_en", "Product name not found")
            nutriscore = data.get("product", {}).get("nutriscore_grade")
            sugar = data.get("product", {}).get("nutriments", {}).get("sugars_prepared_100g")
            carbohydrates = data.get("product", {}).get("nutriments", {}).get("carbohydrates_prepared_100g")
            protein = data.get("product", {}).get("nutriments", {}).get("proteins_prepared_100g")

            call_food_data(product_name, ingredients, nutriscore, sugar, carbohydrates, protein)
        elif choice == "3":
            print("\nSaved Products:")
            for barcode, product in products.items():
                print(f"{barcode}: {product}")
            print("\n")
        elif choice == "4":
            print("Exiting Program")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()


