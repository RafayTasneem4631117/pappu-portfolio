"""Sends the contact-form message to YOUR inbox through SMTP."""
import smtplib
import ssl
from email.message import EmailMessage

from app.config import get_settings
from app.security.spam import clean_header


class EmailNotConfigured(Exception):
    """SMTP_* / CONTACT_TO_EMAIL are missing in backend/.env"""


class EmailSendError(Exception):
    """The SMTP server refused or could not be reached."""


def send_contact_email(name: str, email: str, subject: str, message: str) -> None:
    s = get_settings()
    if not s.email_configured:
        raise EmailNotConfigured()

    msg = EmailMessage()
    msg["From"] = s.smtp_user                 # must be YOUR authenticated address
    msg["To"] = s.contact_to_email
    msg["Reply-To"] = clean_header(email)     # hitting "Reply" answers the visitor
    msg["Subject"] = f"[Portfolio] {clean_header(subject)}"[:200]
    msg.set_content(
        f"New message from your portfolio website\n\n"
        f"Name:  {clean_header(name)}\n"
        f"Email: {clean_header(email)}\n"
        f"Subject: {clean_header(subject)}\n\n"
        f"{message}\n"
    )

    try:
        context = ssl.create_default_context()
        if s.smtp_port == 465:  # implicit TLS
            with smtplib.SMTP_SSL(s.smtp_host, s.smtp_port, timeout=15, context=context) as server:
                server.login(s.smtp_user, s.smtp_password)
                server.send_message(msg)
        else:  # STARTTLS (587)
            with smtplib.SMTP(s.smtp_host, s.smtp_port, timeout=15) as server:
                server.starttls(context=context)
                server.login(s.smtp_user, s.smtp_password)
                server.send_message(msg)
    except (smtplib.SMTPException, OSError) as exc:
        raise EmailSendError(str(exc)) from exc
