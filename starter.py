# The raw passphrase to clean:
raw_phrase = "aP!pL3e#S4aU%cE"

# YOUR GOAL: Clean up this phrase using the 3 Security Rules below!
clean_phrase = ""

for char in raw_phrase:
    if char.isalpha():
        clean_phrase += char.upper()

print(clean_phrase)