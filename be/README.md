
# Transactions API (Django + Django REST Framework)

This backend exposes a simple read-only Transactions API backed by PostgreSQL.

It is designed as a small case-study service for building a pivot-table frontend:
- Stores transaction records (invoices, bills, direct expenses)
- Provides a filtered list endpoint over HTTP
- Includes a seeding script and basic unit tests

---

## Tech stack

- Python 3.11+ (or 3.10+)
- Django 5
- Django REST Framework
- PostgreSQL
- django-cors-headers

---

## Setup Instructions

### 1. Clone the repository
git clone <your-repo-url>
cd be 

## Set up Virtual env
python -m venv .venv
source .venv/bin/activate

## install requirements
pip install -r requirements.txt

## set up Postgres DB
brew services start postgresql
createdb transactions_db

## in settings.py


## create .env
DB_NAME=transactions
DB_USER=admin             # same as `whoami` in terminal
DB_PASSWORD=              # leave blank for local dev
DB_HOST=localhost
DB_PORT=5432
DJANGO_SECRET_KEY =       # in settings.py
DJANGO_DEBUG = True

## seed data 
python manage.py makemigrations
python manage.py migrate
python manage.py shell
from transactions.seed_data import run
run()
exit()

## run server
python manage.py runserver
http://127.0.0.1:8000/api/transactions/

## run tests
python manage.py test







