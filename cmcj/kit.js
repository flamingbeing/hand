// The app kit's theme (app-ui @core/theme, one exact version; the same version is in index.html): look A unless
// this device picks another, the trainer blue as the accent on the light grey ground (near the page's own #f3f2ef),
// light / dark following the phone unless picked. The pages on hand.anawj.com share the choice (same site storage).
// import() so a blocked core.anawj.com leaves the page's own look.
export const KIT = 'https://core.anawj.com/ui/1.0.0-rc.42/';
export const theme = import(KIT + 'theme/index.js')
  .then(t => { t.applyTheme({ accent: '#2563eb', surface: 'grey' }); return t; })
  .catch(() => null);

// "Look on this device": the kit's switch, drawn the first time it is opened
for (const look of document.querySelectorAll('details.look')) {
  look.addEventListener('toggle', () => theme.then(t => {
    const box = look.querySelector('.look-box');
    if (t && box && !box.childElementCount) t.themeSwitch(box);
  }));
}
