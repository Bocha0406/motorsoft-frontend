"""
Простой тест API без базы данных
"""
import requests

API_URL = "http://localhost:8000"

# Тест health check
response = requests.get(f"{API_URL}/")
print(f"Health check: {response.json()}")

# Тест поиска с файлом Toyota
file_path = "/Volumes/Extreme SSD/Проекты Мах/MotorSoft 06.01.26/Toyota Prius 1.8 (89663-47351_E2_EGR).bin"

print(f"\nSearching firmware for: {file_path.split('/')[-1]}")

with open(file_path, 'rb') as f:
    files = {'file': (file_path.split('/')[-1], f, 'application/octet-stream')}
    response = requests.post(f"{API_URL}/api/v1/api/firmware/search", files=files)

print(f"Status: {response.status_code}")
if response.status_code == 200:
    result = response.json()
    print(f"Found: {result.get('found')}")
    print(f"Extracted ID: {result.get('extracted_id')}")
    if result.get('firmware'):
        fw = result['firmware']
        print(f"\n✅ MATCH:")
        print(f"  Brand: {fw['brand']}")
        print(f"  Software ID: {fw['software_id']}")
        print(f"  Price: {fw['price']} ₽")
else:
    print(f"Error: {response.text}")
