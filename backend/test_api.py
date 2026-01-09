"""
Тест API endpoint для поиска прошивки
"""
import requests
import sys

API_URL = "http://localhost:8000/api/v1/api/firmware"

def test_stats():
    """Тест статистики"""
    print("\n" + "="*80)
    print("TEST 1: Get firmware statistics")
    print("="*80)
    
    response = requests.get(f"{API_URL}/stats")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")


def test_search_file(file_path: str):
    """Тест поиска по BIN файлу"""
    print("\n" + "="*80)
    print(f"TEST 2: Search firmware by file")
    print(f"File: {file_path.split('/')[-1]}")
    print("="*80)
    
    with open(file_path, 'rb') as f:
        files = {'file': (file_path.split('/')[-1], f, 'application/octet-stream')}
        response = requests.post(f"{API_URL}/search", files=files)
    
    print(f"Status: {response.status_code}")
    result = response.json()
    
    print(f"\nFound: {result.get('found')}")
    print(f"Message: {result.get('message')}")
    print(f"Extracted ID: {result.get('extracted_id')}")
    
    if result.get('found'):
        firmware = result.get('firmware', {})
        print(f"\n✅ MATCH FOUND IN DATABASE:")
        print(f"  Brand: {firmware.get('brand')}")
        print(f"  Series: {firmware.get('series')}")
        print(f"  ECU: {firmware.get('ecu_brand')}")
        print(f"  Software ID: {firmware.get('software_id')}")
        print(f"  Price: {firmware.get('price')} ₽")
        print(f"  WinOLS File: {firmware.get('winols_file')}")
    else:
        print(f"\n❌ NOT FOUND - needs manual processing")


if __name__ == "__main__":
    # Тест 1: Статистика
    test_stats()
    
    # Тест 2: Поиск Toyota Prius
    test_search_file("/Volumes/Extreme SSD/Проекты Мах/MotorSoft 06.01.26/Toyota Prius 1.8 (89663-47351_E2_EGR).bin")
    
    # Тест 3: Поиск Mazda
    test_search_file("/Volumes/Extreme SSD/Проекты Мах/MotorSoft 06.01.26/Z601EF000Z6V5060-20251229-125826 (1).bin")
