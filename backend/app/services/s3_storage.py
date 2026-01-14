"""
Yandex Object Storage (S3-совместимый) сервис для хранения прошивок.

Использует boto3 для работы с Yandex Cloud Object Storage.
Presigned URLs для безопасной выдачи файлов клиентам.
"""
import boto3
from botocore.exceptions import ClientError
from datetime import datetime
import os
from typing import Optional, BinaryIO

from app.core.config import settings


class S3Storage:
    """Сервис для работы с Yandex Object Storage."""
    
    def __init__(self):
        """Инициализация S3 клиента для Yandex Cloud."""
        # Поддержка обоих форматов переменных окружения
        # S3_ACCESS_KEY (из docker-compose) или YANDEX_S3_ACCESS_KEY_ID (старый)
        access_key = os.getenv('S3_ACCESS_KEY') or settings.YANDEX_S3_ACCESS_KEY_ID
        secret_key = os.getenv('S3_SECRET_KEY') or settings.YANDEX_S3_SECRET_ACCESS_KEY
        bucket_name = os.getenv('S3_BUCKET_NAME') or settings.YANDEX_S3_BUCKET
        endpoint_url = os.getenv('S3_ENDPOINT_URL') or 'https://storage.yandexcloud.net'
        
        self.bucket_name = bucket_name
        self.client = boto3.client(
            's3',
            endpoint_url=endpoint_url,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name='ru-central1'
        )
    
    def upload_file(
        self,
        file_obj: BinaryIO,
        filename: str,
        content_type: str = 'application/octet-stream'
    ) -> dict:
        """
        Загрузить файл в Object Storage.
        
        Args:
            file_obj: Файловый объект для загрузки
            filename: Имя файла в хранилище
            content_type: MIME-тип файла
            
        Returns:
            dict с информацией о загруженном файле
        """
        try:
            # Уникальное имя с датой
            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            key = f"firmwares/{timestamp}_{filename}"
            
            self.client.upload_fileobj(
                file_obj,
                self.bucket_name,
                key,
                ExtraArgs={'ContentType': content_type}
            )
            
            # Получить размер файла
            response = self.client.head_object(Bucket=self.bucket_name, Key=key)
            size = response.get('ContentLength', 0)
            
            return {
                'success': True,
                'key': key,
                'filename': filename,
                'size': size,
                'bucket': self.bucket_name,
                'uploaded_at': datetime.utcnow().isoformat()
            }
            
        except ClientError as e:
            return {
                'success': False,
                'error': str(e),
                'filename': filename
            }
    
    def generate_download_url(
        self,
        key: str,
        expires_in: int = 3600  # 1 час по умолчанию
    ) -> Optional[str]:
        """
        Сгенерировать временную ссылку на скачивание.
        
        Presigned URL - безопасный способ выдачи файлов:
        - Ссылка действует ограниченное время
        - Нельзя передать другу через день
        - Клиент качает напрямую с Yandex Cloud
        
        Args:
            key: Ключ (путь) файла в хранилище
            expires_in: Время жизни ссылки в секундах (по умолчанию 1 час)
            
        Returns:
            Presigned URL или None при ошибке
        """
        try:
            url = self.client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': key
                },
                ExpiresIn=expires_in
            )
            return url
        except ClientError:
            return None
    
    def delete_file(self, key: str) -> bool:
        """
        Удалить файл из хранилища.
        
        Args:
            key: Ключ (путь) файла
            
        Returns:
            True если успешно удалён
        """
        try:
            self.client.delete_object(Bucket=self.bucket_name, Key=key)
            return True
        except ClientError:
            return False
    
    def list_files(self, prefix: str = 'firmwares/') -> list:
        """
        Получить список файлов в хранилище.
        
        Args:
            prefix: Префикс пути (папка)
            
        Returns:
            Список файлов с метаданными
        """
        try:
            response = self.client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix
            )
            
            files = []
            for obj in response.get('Contents', []):
                files.append({
                    'key': obj['Key'],
                    'size': obj['Size'],
                    'last_modified': obj['LastModified'].isoformat(),
                    'filename': obj['Key'].split('/')[-1]
                })
            
            return files
            
        except ClientError:
            return []
    
    def file_exists(self, key: str) -> bool:
        """Проверить существует ли файл."""
        try:
            self.client.head_object(Bucket=self.bucket_name, Key=key)
            return True
        except ClientError:
            return False


# Глобальный экземпляр
s3_storage = S3Storage()
