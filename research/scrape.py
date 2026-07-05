#!/usr/bin/env python3
"""Scrape supplement stack data from text-based sources."""
import requests, re

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

# Try pages known to have text-based supplement info
urls = [
    "https://www.levelshealth.com/blog/supplement-protocols-of-top-health-influencers",
    "https://theislandnow.com/blog-112/supplement-protocols-health-influencers/",
    "https://www.menshealth.com/health/g19546532/celebrity-supplement-routines/",
]

for url in urls:
    try:
        print(f"\n=== {url} ===")
        r = requests.get(url, headers=HEADERS, timeout=30)
        print(f"Status: {r.status_code}, Length: {len(r.text)}")
        text = re.sub(r'<script[^>]*>.*?</script>', '', r.text, flags=re.DOTALL)
        text = re.sub(r'<style[^>]*>.*?</style>', '', r.text, flags=re.DOTALL)
        text = re.sub(r'<[^>]+>', '\n', text)
        text = re.sub(r'\n\s*\n', '\n', text)
        text = re.sub(r'[ \t]+', ' ', text)
        lines = [l.strip() for l in text.split('\n') if l.strip() and len(l.strip()) > 10]
        for i, line in enumerate(lines[:800]):
            low = line.lower()
            if any(w in low for w in ['supplement', 'vitamin d', 'magnesium', 'omega-3', 'fish oil', 'creatine', 'ashwagandha', 'huberman', 'attia', 'patrick', 'asprey']):
                print(f"[{i}] {line[:300]}")
    except Exception as e:
        print(f"Error: {e}")