
import hmac
import hashlib
import base64

def generateHMACSHA256(key : str,message : str):
    dig = hmac.new(key.encode(),msg=message.encode(),digestmod=hashlib.sha256).digest()
    return base64.b64encode(dig).decode()

