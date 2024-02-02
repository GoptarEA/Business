import smtplib

def send_email():
    # данные почтового сервиса
    user = "goptarea@yandexlyceum.ru"
    passwd = ""
    server = "smtp.yandex.ru"
    port = 587

    # тема письма
    subject = "Бронирование Добрилово"
    # кому
    to = "goptarea@gmail.com"
    # кодировка письма
    charset = 'Content-Type: text/plain; charset=utf-8'
    mime = 'MIME-Version: 1.0'
    # текст письма
    text = "Отправкой почты управляет Python!"

    # формируем тело письма
    body = "\r\n".join((f"From: {user}", f"To: {to}",
                        f"Subject: {subject}", mime, charset, "", text))

    try:
        # подключаемся к почтовому сервису
        smtp = smtplib.SMTP(server, port)
        smtp.starttls()
        smtp.ehlo()
        # логинимся на почтовом сервере
        smtp.login(user, passwd)
        # пробуем послать письмо
        smtp.sendmail(user, to, body.encode('utf-8'))
    except smtplib.SMTPException as err:
        print('Что - то пошло не так...')
        raise err
    finally:
        smtp.quit()
