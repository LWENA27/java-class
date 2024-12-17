public class CharacterManipulation {
    public static void main(String[] args) {
        char ch = 'L';

        // Check if the character is a letter
        if (Character.isLetter(ch)) {
            System.out.println(ch + " is a letter.");
        }

        // Check if the character is uppercase
        if (Character.isUpperCase(ch)) {
            System.out.println(ch + " is uppercase.");
        }

        // Convert to lowercase
        char lowerCase = Character.toLowerCase(ch);
        System.out.println("Lowercase: " + lowerCase);

        // Check if a character is a digit
        char digit = '9';
        if (Character.isDigit(digit)) {
            System.out.println(digit + " is a digit.");
        }
    }
}
