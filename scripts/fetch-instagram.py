#!/usr/bin/env python3
"""Instagram collector API — fetches @coach_kings2 reels, thumbnails, and storytelling data."""

import json
import re
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

USERNAME = 'coach_kings2'
ROOT = Path(__file__).resolve().parents[1]
THUMB_DIR = ROOT / 'images' / 'instagram'
DATA_FILE = ROOT / 'data' / 'instagram-videos.json'
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'x-ig-app-id': '936619743392459',
}


def fetch_profile(username: str, retries: int = 3) -> dict:
    url = f'https://www.instagram.com/api/v1/users/web_profile_info/?username={username}'
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.load(resp)
            if data.get('status') != 'ok':
                raise RuntimeError(data.get('message', 'Instagram API error'))
            return data['data']['user']
        except urllib.error.HTTPError as exc:
            if attempt < retries - 1:
                time.sleep(30 * (attempt + 1))
                continue
            raise exc
    raise RuntimeError('Instagram API unreachable')


def hashtags(caption: str) -> list[str]:
    return re.findall(r'#(\w+)', caption)


def story_text(caption: str) -> str:
    text = re.sub(r'#\w+', '', caption)
    text = re.sub(r'\s*\.\s*', '. ', text)
    return ' '.join(text.split()).strip(' .')


def title_from(caption: str) -> str:
    first = re.split(r'[.!?\n]', caption)[0].strip()
    return (first[:70] + '...') if len(first) > 73 else first or 'Training Reel'


def tag_from(caption: str) -> str:
    c = caption.lower()
    if 'pad' in c or 'mitt' in c:
        return 'Pad Work'
    if 'spar' in c:
        return 'Sparring'
    if 'youth' in c or 'junior' in c:
        return 'Youth'
    if 'core' in c or 'squat' in c or 'medball' in c:
        return 'S&C'
    if 'roll' in c or 'defen' in c:
        return 'Defence'
    if 'boxing' in c:
        return 'Boxing'
    return 'Reel'


def download(url: str, path: Path) -> None:
    req = urllib.request.Request(url, headers={**HEADERS, 'Referer': 'https://www.instagram.com/'})
    with urllib.request.urlopen(req, timeout=60) as resp:
        path.write_bytes(resp.read())


def main() -> None:
    THUMB_DIR.mkdir(parents=True, exist_ok=True)
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)

    user = fetch_profile(USERNAME)
    edges = user['edge_owner_to_timeline_media']['edges']
    videos = []

    for edge in edges:
        node = edge['node']
        if not node.get('is_video'):
            continue

        shortcode = node['shortcode']
        caption = ''
        if node.get('edge_media_to_caption', {}).get('edges'):
            caption = node['edge_media_to_caption']['edges'][0]['node']['text']

        thumb_url = node.get('thumbnail_src') or node.get('display_url')
        thumb_path = THUMB_DIR / f'{shortcode}.jpg'
        if thumb_url:
            download(thumb_url, thumb_path)

        ts = node.get('taken_at_timestamp')
        posted = datetime.fromtimestamp(ts, tz=timezone.utc).strftime('%d %b %Y') if ts else ''
        duration = node.get('video_duration')
        likes = node.get('edge_liked_by', {}).get('count')

        videos.append({
            'shortcode': shortcode,
            'title': title_from(caption),
            'story': story_text(caption),
            'caption': caption,
            'hashtags': hashtags(caption),
            'thumbnail': f'images/instagram/{shortcode}.jpg',
            'url': f'https://www.instagram.com/reel/{shortcode}/',
            'embedUrl': f'https://www.instagram.com/reel/{shortcode}/embed',
            'tag': tag_from(caption),
            'postedAt': posted,
            'duration': f'0:{int(duration):02d}' if duration else None,
            'likes': likes,
        })

    payload = {
        'fetchedAt': datetime.now(timezone.utc).isoformat(),
        'username': user['username'],
        'fullName': user['full_name'],
        'bio': user['biography'],
        'profileUrl': f'https://www.instagram.com/{USERNAME}/',
        'videoCount': len(videos),
        'videos': videos,
    }

    DATA_FILE.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'Collected {len(videos)} Instagram reels -> {DATA_FILE}')


if __name__ == '__main__':
    main()
