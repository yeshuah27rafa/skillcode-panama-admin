// ============================================================
// components/NotebookCard.jsx — elemento firma del Hero.
// Alterna entre un apunte de matemática y uno de código,
// como una página real de cuaderno de clase.
// ============================================================

import { useEffect, useState } from 'react';

const PAGES = [
  {
    label: '// apuntes — matemática aplicada',
    tag: 'razones_de_cambio.md',
    lines: [
      [{ t: 'cm', v: '# Si el área de un círculo crece,' }],
      [{ t: 'cm', v: '# ¿qué tan rápido crece el radio?' }],
      [],
      [{ t: 'kw', v: 'A' }, { t: 'txt', v: ' = ' }, { t: 'fn', v: 'π' }, { t: 'txt', v: ' · r' }, { t: 'num', v: '²' }],
      [{ t: 'kw', v: 'dA/dt' }, { t: 'txt', v: ' = 2' }, { t: 'fn', v: 'π' }, { t: 'txt', v: 'r · (' }, { t: 'kw', v: 'dr/dt' }, { t: 'txt', v: ')' }],
      [],
      [{ t: 'cm', v: '# despeja dr/dt y sustituye' }],
      [{ t: 'kw', v: 'dr/dt' }, { t: 'txt', v: ' = dA/dt / (2' }, { t: 'fn', v: 'π' }, { t: 'txt', v: 'r)' }]
    ]
  },
  {
    label: '// apuntes — lógica de programación',
    tag: 'promedio.js',
    lines: [
      [{ t: 'kw', v: 'function' }, { t: 'fn', v: ' promedio' }, { t: 'txt', v: '(notas) {' }],
      [{ t: 'kw', v: '  let' }, { t: 'txt', v: ' suma = ' }, { t: 'num', v: '0' }, { t: 'txt', v: ';' }],
      [],
      [{ t: 'kw', v: '  for' }, { t: 'txt', v: ' (const n of notas) {' }],
      [{ t: 'txt', v: '    suma = suma + n;' }],
      [{ t: 'txt', v: '  }' }],
      [],
      [{ t: 'kw', v: '  return' }, { t: 'txt', v: ' suma / notas.length;' }],
      [{ t: 'txt', v: '}' }]
    ]
  },
  {
    label: '// apuntes — QA / testing',
    tag: 'caso_prueba.md',
    lines: [
      [{ t: 'cm', v: '# Caso de prueba: login inválido' }],
      [],
      [{ t: 'kw', v: 'Dado' }, { t: 'txt', v: ' un usuario sin registrar' }],
      [{ t: 'kw', v: 'Cuando' }, { t: 'txt', v: ' intenta iniciar sesión' }],
      [{ t: 'kw', v: 'Entonces' }, { t: 'txt', v: ' el sistema responde' }],
      [{ t: 'str', v: '"Credenciales inválidas"' }],
      [],
      [{ t: 'cm', v: '# resultado esperado: HTTP 401' }]
    ]
  }
];

export default function NotebookCard() {
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPageIndex((current) => (current + 1) % PAGES.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, []);

  const page = PAGES[pageIndex];

  return (
    <div className="notebook">
      <div className="notebook__bar">
        <span className="notebook__bar-title">cuaderno_de_clase</span>
        <div className="notebook__bar-dots"><span></span><span></span><span></span></div>
      </div>

      <div className="notebook__body">
        <span className="notebook__label">{page.label}</span>
        <div className="notebook__snippet">
          {page.lines.map((line, lineIndex) => (
            <div key={lineIndex}>
              {line.length === 0 ? (
                '\u00A0'
              ) : (
                line.map((token, tokenIndex) => (
                  <span key={tokenIndex} className={token.t === 'txt' ? '' : 'tok-' + token.t}>{token.v}</span>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="notebook__footer">
        <span className="notebook__tag">{page.tag}</span>
        <div className="notebook__switch">
          {PAGES.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={'Ver apunte ' + (index + 1)}
              className={index === pageIndex ? 'is-active' : ''}
              onClick={() => setPageIndex(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}
