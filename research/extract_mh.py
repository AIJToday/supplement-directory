import re, json

with open('/tmp/mh_supps.json', 'r') as f:
    text = f.read()

# Find JSON data
m = re.search(r'<script[^>]*id="__NEXT_DATA__"[^>]*>(.*?)</script>', text, re.DOTALL)
if m:
    data = json.loads(m.group(1))
    props = data.get('props', {}).get('pageProps', {}).get('data', {})
    content = props.get('content', [])
    for item in content:
        section = item.get('section', {})
        title = section.get('title', '')
        print(f"Section: {title}")
        if 'media' in section:
            for media in section['media']:
                mtitle = media.get('title', '')
                desc = media.get('description', '')
                print(f"  Title: {mtitle[:200]}")
                if desc:
                    print(f"  Desc: {desc[:300]}")
                print()
else:
    # Try different patterns  
    for m in re.finditer(r'"title":"([^"]+)"', text):
        t = m.group(1)
        if any(w in t.lower() for w in ['supplement', 'stack', 'vitamin', 'routine']):
            print(t)