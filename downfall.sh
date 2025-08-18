#!/bin/bash

# Target URL - change this to your own test server
BASE_URL="https://umukamezi.com/search-result.php?_csrf=6c7466e882884047a20ef969f052797b&search_text="

# Number of requests to send
TOTAL_REQUESTS=10000000000000000000000

# Function to generate random search text
generate_random_text() {
    tr -dc A-Za-z0-9 </dev/urandom | head -c 10
}

echo "Sending $TOTAL_REQUESTS requests to $BASE_URL..."

# Loop through and send requests
for ((i=1; i<=TOTAL_REQUESTS; i++))
do
    RANDOM_TEXT=$(generate_random_text)
    FULL_URL="${BASE_URL}${RANDOM_TEXT}"

    echo "[$i] Request URL: $FULL_URL"

    # Send GET request and print the first 300 characters of the response
    RESPONSE=$(curl -s "$FULL_URL" | head -c 300)

    echo "[$i] Response:"
    echo "$RESPONSE"
    echo "------------------------------------------------------"

    # Optional: wait 1 second between requests
    sleep 1
done

echo "All $TOTAL_REQUESTS requests completed."
