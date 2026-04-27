import os
import httpx
from datetime import datetime, timedelta
from typing import Dict, Optional
from decimal import Decimal

# Cache for exchange rates
_rates_cache: Dict[str, tuple] = {}
CACHE_DURATION = timedelta(hours=24)

# Supported currencies
SUPPORTED_CURRENCIES = [
    "USD", "EUR", "GBP", "JPY", "CAD", "AUD",
    "CHF", "CNY", "INR", "SGD", "NZD", "MXN",
    "BRL", "ZAR", "KRW", "SEK", "NOK", "DKK",
    "PLN", "THB", "IDR", "HUF", "CZK", "ILS",
    "CLP", "PHP", "AED", "COP", "SAR", "MYR",
    "RON", "ARS", "PEN", "UYU", "VND", "EGP",
    "NGN", "KES", "GHS", "TZS", "UGX", "ZMW",
    "XOF", "XAF", "BWP", "MAD", "DZD", "TND"
]

CURRENCY_SYMBOLS = {
    "USD": "$",
    "EUR": "€",
    "GBP": "£",
    "JPY": "¥",
    "CAD": "C$",
    "AUD": "A$",
    "CHF": "CHF",
    "CNY": "¥",
    "INR": "₹",
    "SGD": "S$",
    "NZD": "NZ$",
    "MXN": "MX$",
    "BRL": "R$",
    "ZAR": "R",
    "KRW": "₩",
    "SEK": "kr",
    "NOK": "kr",
    "DKK": "kr",
    "PLN": "zł",
    "THB": "฿",
    "IDR": "Rp",
    "HUF": "Ft",
    "CZK": "Kč",
    "ILS": "₪",
    "CLP": "CLP$",
    "PHP": "₱",
    "AED": "د.إ",
    "COP": "COL$",
    "SAR": "﷼",
    "MYR": "RM",
    "RON": "lei",
    "ARS": "AR$",
    "PEN": "S/.",
    "UYU": "$U",
    "VND": "₫",
    "EGP": "E£",
    "NGN": "₦",
    "KES": "KSh",
    "GHS": "GH₵",
    "TZS": "TSh",
    "UGX": "USh",
    "ZMW": "ZK",
    "XOF": "CFA",
    "XAF": "FCFA",
    "BWP": "P",
    "MAD": "DH",
    "DZD": "DA",
    "TND": "DT"
}


async def fetch_exchange_rates(base_currency: str = "USD") -> Dict[str, Decimal]:
    """Fetch exchange rates from a free API (exchangerate-api.com)."""
    # Check cache first
    cache_key = f"rates_{base_currency}"
    if cache_key in _rates_cache:
        rates, timestamp = _rates_cache[cache_key]
        if datetime.now() - timestamp < CACHE_DURATION:
            return rates
    
    # Fetch from API
    api_key = os.getenv("EXCHANGE_RATE_API_KEY")
    
    if api_key:
        # Use paid API if key available
        url = f"https://v6.exchangerate-api.com/v6/{api_key}/latest/{base_currency}"
    else:
        # Use free API (limited requests)
        url = f"https://api.exchangerate-api.com/v4/latest/{base_currency}"
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            
            if "rates" in data:
                rates = {k: Decimal(str(v)) for k, v in data["rates"].items() if k in SUPPORTED_CURRENCIES}
                # Cache the rates
                _rates_cache[cache_key] = (rates, datetime.now())
                return rates
            elif "conversion_rates" in data:
                rates = {k: Decimal(str(v)) for k, v in data["conversion_rates"].items() if k in SUPPORTED_CURRENCIES}
                _rates_cache[cache_key] = (rates, datetime.now())
                return rates
            else:
                raise ValueError("Unexpected API response format")
                
    except Exception as e:
        # Fallback to cached rates or default rates
        if cache_key in _rates_cache:
            rates, _ = _rates_cache[cache_key]
            return rates
        # Return default rates (USD base)
        return get_default_rates()


def get_default_rates() -> Dict[str, Decimal]:
    """Return default exchange rates (approximate, for fallback)."""
    return {
        "USD": Decimal("1.0"),
        "EUR": Decimal("0.85"),
        "GBP": Decimal("0.73"),
        "JPY": Decimal("110.0"),
        "CAD": Decimal("1.25"),
        "AUD": Decimal("1.35"),
        "CHF": Decimal("0.92"),
        "CNY": Decimal("6.45"),
        "INR": Decimal("74.5"),
        "SGD": Decimal("1.35"),
        "NZD": Decimal("1.42"),
        "MXN": Decimal("20.0"),
        "BRL": Decimal("5.25"),
        "ZAR": Decimal("14.5"),
        "KRW": Decimal("1180.0"),
        "SEK": Decimal("8.6"),
        "NOK": Decimal("8.5"),
        "DKK": Decimal("6.3"),
        "PLN": Decimal("3.9"),
        "THB": Decimal("33.0"),
        "IDR": Decimal("14300.0"),
        "HUF": Decimal("305.0"),
        "CZK": Decimal("22.0"),
        "ILS": Decimal("3.2"),
        "CLP": Decimal("800.0"),
        "PHP": Decimal("50.0"),
        "AED": Decimal("3.67"),
        "COP": Decimal("3800.0"),
        "SAR": Decimal("3.75"),
        "MYR": Decimal("4.15"),
        "RON": Decimal("4.2"),
        "ARS": Decimal("100.0"),
        "PEN": Decimal("4.0"),
        "UYU": Decimal("43.0"),
        "VND": Decimal("23000.0"),
        "EGP": Decimal("15.7"),
        "NGN": Decimal("410.0"),
        "KES": Decimal("110.0"),
        "GHS": Decimal("6.0"),
        "TZS": Decimal("2300.0"),
        "UGX": Decimal("3600.0"),
        "ZMW": Decimal("18.0"),
        "XOF": Decimal("550.0"),
        "XAF": Decimal("550.0"),
        "BWP": Decimal("11.0"),
        "MAD": Decimal("9.0"),
        "DZD": Decimal("135.0"),
        "TND": Decimal("2.8"),
    }


async def get_exchange_rate(from_currency: str, to_currency: str = "USD") -> Decimal:
    """Get exchange rate from one currency to another."""
    if from_currency == to_currency:
        return Decimal("1.0")
    
    rates = await fetch_exchange_rates(to_currency)
    rate = rates.get(from_currency)
    
    if rate is None:
        # Fallback: fetch USD-based rates and calculate
        usd_rates = await fetch_exchange_rates("USD")
        from_rate = usd_rates.get(from_currency)
        to_rate = usd_rates.get(to_currency)
        
        if from_rate and to_rate:
            return from_rate / to_rate
        
        raise ValueError(f"Exchange rate not available for {from_currency} to {to_currency}")
    
    return rate


def convert_amount(amount: Decimal, from_rate: Decimal, to_rate: Decimal) -> Decimal:
    """Convert amount using exchange rates."""
    if from_rate == to_rate:
        return amount
    return (amount / from_rate) * to_rate


def format_currency(amount: Decimal, currency_code: str) -> str:
    """Format amount with currency symbol."""
    symbol = CURRENCY_SYMBOLS.get(currency_code, currency_code)
    
    # Format with 2 decimal places
    formatted_amount = f"{amount:,.2f}"
    
    # Place symbol correctly
    if currency_code in ["USD", "CAD", "AUD", "NZD", "MXN", "ARS", "CLP", "HKD", "SGD"]:
        return f"{symbol}{formatted_amount}"
    elif currency_code in ["EUR", "GBP", "JPY", "CNY", "INR", "KRW", "BRL", "ZAR", "CHF", "PLN", "SEK", "NOK", "DKK", "THB", "VND", "EGP", "NGN", "KES", "GHS", "TZS", "UGX", "ZMW"]:
        return f"{symbol}{formatted_amount}"
    else:
        return f"{formatted_amount} {currency_code}"


def get_currency_choices() -> list:
    """Get list of currency choices for forms."""
    return [(code, f"{code} - {CURRENCY_SYMBOLS.get(code, code)}") for code in SUPPORTED_CURRENCIES]
