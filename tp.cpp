#include <iostream>
#include <vector>

std::vector<int> incrementLargeInteger(std::vector<int>& digits) {
    int carry = 1;  // Initialize carry to 1 to increment the integer.
    int n = digits.size();

    for (int i = n - 1; i >= 0; i--) {
        int sum = digits[i] + carry;
        carry = sum / 10;
        digits[i] = sum % 10;
    }

    if (carry > 0) {
        // If there's still a carry, add it as a new most significant digit.
        digits.insert(digits.begin(), carry);
    }

    return digits;
}

int main() {
    std::vector<int> digits = {9, 9, 9};  // Example input: [9, 9, 9]
    
    std::vector<int> result = incrementLargeInteger(digits);
    
    // Print the result
    for (int digit : result) {
        std::cout << digit << " ";
    }
    
    return 0;
}
