from datetime import date
import requests
barcode = 3033710065967 #3017624010701

#3017624010701
url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}"
headers = {
   "User-Agent": "MyBarcodeApp/1.0"
}

response = requests.get(url, headers=headers)
data = response.json()

product_name = data.get("product", {}).get("product_name", "Product name not found")
ingredients = data.get("product", {}).get("ingredients_text_en", "Product name not found")

nutriscore = data.get("product", {}).get("nutriscore_grade")
sugar = data.get("product", {}).get("nutriments", {}).get("sugars_prepared_100g")
carbohydrates = data.get("product", {}).get("nutriments", {}).get("carbohydrates_prepared_100g")
protein = data.get("product", {}).get("nutriments", {}).get("proteins_prepared_100g")

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

def print_menu():
    print("1. View Product Information")
    print("2. Exit")

def main():
    while True:
        print_menu()
        choice = input("Enter your choice: ")
        if choice == "1":
            print(f"Product Name: {product_name}")
            print(f"Ingredients: {ingredients}")
            print(get_recommendation(nutriscore, sugar, carbohydrates, protein))
        elif choice == "2":
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()




