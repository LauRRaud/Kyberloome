"""Makes the Limit Notch page in every language of the app: index.html (English) at the top and
<code>/index.html for the others, from page.html and text.json, and the sitemap listing them all.

    python i18n/build.py

The panel's own words (Week, the units of its times, the notification) are the app's, from its
Strings.cs, kept in text.json under `app`."""

import html
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
ORIGIN = 'https://limitnotch.com'
STORE = 'https://apps.microsoft.com/detail/9P65S14KRHFR'
CJK = ('ja', 'zh-hans', 'zh-hant')
def esc(text):
    return html.escape(text, quote=True)


def hours(app, n):
    return str(n) + app['HourUnit']


def days(app, n):
    return str(n) + app['DayUnit']


def minutes(app, n):
    return str(n) + app['MinuteUnit']


# As the app writes how long is left: "2h 14m", "2d 9h" - with this language's units.
def remaining(app, total):
    if total >= 1440:
        return days(app, total // 1440) + ' ' + hours(app, total % 1440 // 60)
    if total >= 60:
        return hours(app, total // 60) + ' ' + minutes(app, total % 60)
    return minutes(app, total)


def url(language):
    return ORIGIN + language['path']


# Where the maker's pages are in this language: in Estonian or in English.
def maker(language):
    if language['code'] == 'et':
        return 'https://kyberloome.ee/', 'https://kyberloome.ee/privaatsus/rakendused', 'https://kyberloome.ee/#kontakt'
    return 'https://kyberloome.ee/en', 'https://kyberloome.ee/en/privacy/apps', 'https://kyberloome.ee/en#contact'


# On the English page, a first visit goes to the page in the browser's language, if there is
# one; a language picked at the foot of a page is remembered and wins.
def redirect(languages):
    pages = {l['code']: l['path'] for l in languages}
    asked = {}
    for l in languages:
        asked[l['code']] = l['path']
        asked[l['hreflang'].lower()] = l['path']
    asked.update({'pt': '/pt-br/', 'pt-pt': '/pt-br/', 'zh': '/zh-hans/', 'zh-cn': '/zh-hans/', 'zh-sg': '/zh-hans/',
                  'zh-tw': '/zh-hant/', 'zh-hk': '/zh-hant/', 'zh-mo': '/zh-hant/'})
    return ('<script>(function(){try{var P=' + json.dumps(pages, separators=(',', ':')) + ',A=' + json.dumps(asked, separators=(',', ':'))
            + ',k=localStorage.getItem("limitnotch-lang"),go=k&&P[k];'
            + 'if(!k){var l=navigator.languages||[navigator.language||""];for(var i=0;i<l.length&&!go;i++){var c=String(l[i]).toLowerCase();go=A[c]||A[c.split("-")[0]];}}'
            + 'if(go&&go!=="/")location.replace(go+location.hash);}catch(e){}})();</script>\n')


def page(template, language, languages):
    t, app, code = language['text'], language['app'], language['code']
    join = '' if code in CJK else ' '
    maker_url, privacy_url, contact_url = maker(language)
    alternates = ''.join('<link rel="alternate" hreflang="%s" href="%s">\n' % (l['hreflang'], url(l)) for l in languages)
    alternates += '<link rel="alternate" hreflang="x-default" href="%s/">' % ORIGIN
    expires = app['ExpiresIn'].replace('{0}', remaining(app, 14 * 1440 + 23 * 60))
    toast_line = 'ChatGPT · ' + app['ResetsAvailable'].replace('{0}', '1') + ' · ' + expires
    ld = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'Limit Notch',
        'alternateName': 'Limit Notch: AI Usage Limits & Resets',
        'description': t['description'],
        'inLanguage': language['hreflang'],
        'applicationCategory': 'UtilitiesApplication',
        'operatingSystem': 'Windows 10 (1809 or later), Windows 11',
        'url': url(language),
        'downloadUrl': STORE,
        'image': ORIGIN + '/assets/og.png',
        'offers': {'@type': 'Offer', 'price': '1.99', 'priceCurrency': 'EUR', 'url': STORE},
        'publisher': {'@type': 'Organization', 'name': 'Kÿberloome', 'url': maker_url},
    }
    # Every language a link of its own (search engines follow them), by its native name; the one
    # shown is marked.
    items = ''.join('<li><a href="%s" hreflang="%s" lang="%s" data-code="%s"%s>%s</a></li>'
                    % (l['path'], l['hreflang'], l['hreflang'], l['code'], ' class="now" aria-current="page"' if l is language else '', esc(l['name']))
                    for l in languages)
    # What the script writes: the hints, the demo's captions, the terminal's sessions, the units.
    script = {k: t[k] for k in ('tryWord', 'tryIt', 'clickIt', 'dragIt', 'tapIt', 'tapAgain', 'cap1', 'cap2', 'cap3', 'egg', 'flaky', 'rust')}
    script.update(join=join, units={'d': app['DayUnit'], 'h': app['HourUnit'], 'm': app['MinuteUnit']})
    values = {
        'lang': language['hreflang'], 'dir': language['dir'],
        'title': esc(t['title']), 'description': esc(t['description']), 'canonical': url(language), 'alternates': alternates,
        'ogLocale': language['locale'], 'ogTitle': esc(t['ogTitle']), 'tagline': esc(t['tagline']),
        'jsonld': '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False).replace('</', '<\\/') + '</script>',
        'redirect': redirect(languages) if language['path'] == '/' else '',
        'notchLabel': esc(t['notchLabel']),
        'h5': esc(hours(app, 5)), 'week': esc(app['Week']), 'd30': esc(days(app, 30)), 'exp14': esc(days(app, 14)),
        't1': esc(remaining(app, 134)), 't2': esc(remaining(app, 2 * 1440 + 9 * 60)), 't3': esc(remaining(app, 22 * 1440 + 5 * 60)),
        'tryIt': esc(t['tryIt']), 'getIt': esc(t['getIt']), 'getItLabel': esc(t['getItLabel']), 'scroll': esc(t['scroll']),
        'demoLabel': esc(t['demoLabel']), 'toastTitle': esc(app['NewReset']), 'toastLine': esc(toast_line),
        'cap1': esc(join.join(t['cap1'])), 'privateTitle': esc(t['privateTitle']), 'privateLine': esc(t['privateLine']),
        'makerUrl': maker_url, 'privacyUrl': privacy_url, 'contactUrl': contact_url,
        'privacy': esc(t['privacy']), 'contact': esc(t['contact']),
        'languageMenu': esc(app['LanguageMenu']), 'languageItems': items,
        'sections': esc(t['sections']), 'navStart': esc(t['navStart']), 'navHow': esc(t['navHow']),
        'navGet': esc(t['navGet']), 'navPrivate': esc(t['navPrivate']),
        'textJson': json.dumps(script, ensure_ascii=False).replace('</', '<\\/'),
    }
    out = template
    for key, value in values.items():
        out = out.replace('{{' + key + '}}', value)
    assert '{{' not in out, (code, out[out.index('{{'):out.index('{{') + 40])
    return out


def main():
    template = open(os.path.join(HERE, 'page.html'), encoding='utf-8').read()
    languages = json.load(open(os.path.join(HERE, 'text.json'), encoding='utf-8'))['languages']
    for language in languages:
        folder = os.path.join(SITE, language['path'].strip('/'))
        os.makedirs(folder, exist_ok=True)
        open(os.path.join(folder, 'index.html'), 'w', encoding='utf-8', newline='\n').write(page(template, language, languages))
    # Every page, each with all its languages.
    links = ''.join('    <xhtml:link rel="alternate" hreflang="%s" href="%s"/>\n' % (l['hreflang'], url(l)) for l in languages)
    links += '    <xhtml:link rel="alternate" hreflang="x-default" href="%s/"/>\n' % ORIGIN
    entries = ''.join('  <url>\n    <loc>%s</loc>\n%s  </url>\n' % (url(l), links) for l in languages)
    open(os.path.join(SITE, 'sitemap.xml'), 'w', encoding='utf-8', newline='\n').write(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        + entries + '</urlset>\n')
    print('made', len(languages), 'pages')


if __name__ == '__main__':
    main()
