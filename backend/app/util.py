import os
from fastapi import UploadFile
import smtplib
import socket
from email.message import EmailMessage
import typing

image_path = './img'

async def add_img(img: UploadFile):
    os.makedirs(image_path, exist_ok=True)
    img_path = os.path.join(image_path, img.filename)
    with open(img_path, 'wb') as file:
        content = await img.read()
        file.write(content)



def sanitize_hostname(hostname):
    # Replace non-ASCII characters with a placeholder or remove them
    return ''.join(c if ord(c) < 128 else '_' for c in hostname)


async def send_mail(to: str, subject: str, message: str) -> typing.Optional[True]:
    try:
        # Sanitize local hostname to ensure it only contains ASCII characters
        local_hostname = sanitize_hostname(socket.gethostname())
        
        # Create SMTP session with sanitized hostname
        smtpObj = smtplib.SMTP('smtp.yandex.ru', 587, local_hostname=local_hostname)
        smtpObj.ehlo()
        smtpObj.starttls()
        smtpObj.login('Kursachmoment@yandex.ru', 'afwdjrfwspfczvsv')
        
        # Construct the email message
        msg = EmailMessage()
        msg.set_content(message)
        msg['Subject'] = subject
        msg['From'] = 'Kursachmoment@yandex.ru'
        msg['To'] = to
        
        # Adding more headers to avoid spam filters
        msg['Reply-To'] = 'Kursachmoment@yandex.ru'
        
        smtpObj.send_message(msg)
        smtpObj.quit()
        return True
    except Exception:
        return None

