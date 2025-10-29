/**
 * Script para verificar problemas de anidación HTML en React
 * 
 * Este script ayuda a identificar patrones que pueden causar errores de hydratación
 * como elementos de bloque dentro de elementos inline.
 * 
 * Ejecutar desde la consola del navegador:
 * 1. Abrir DevTools (F12)
 * 2. Copiar y pegar este código
 * 3. Revisar los warnings en la consola
 */

(function checkHTMLNesting() {
  console.log('🔍 Verificando problemas de anidación HTML...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const issues = [];

  // Verificar <p> que contengan elementos de bloque
  const paragraphs = document.querySelectorAll('p');
  paragraphs.forEach((p, index) => {
    const blockElements = p.querySelectorAll('div, section, article, header, footer, nav, aside, main, figure, figcaption, h1, h2, h3, h4, h5, h6, ul, ol, li, table, form');
    if (blockElements.length > 0) {
      issues.push({
        type: 'BLOCK_IN_PARAGRAPH',
        element: p,
        blockElements: Array.from(blockElements),
        message: `<p> contiene ${blockElements.length} elemento(s) de bloque`,
        severity: 'ERROR'
      });
    }
  });

  // Verificar elementos inline que contengan elementos de bloque
  const inlineElements = document.querySelectorAll('span, a, em, strong, code, small');
  inlineElements.forEach((el) => {
    const blockElements = el.querySelectorAll('div, section, article, header, footer, nav, aside, main, figure, figcaption, h1, h2, h3, h4, h5, h6, ul, ol, li, table, form');
    if (blockElements.length > 0) {
      issues.push({
        type: 'BLOCK_IN_INLINE',
        element: el,
        blockElements: Array.from(blockElements),
        message: `<${el.tagName.toLowerCase()}> contiene ${blockElements.length} elemento(s) de bloque`,
        severity: 'WARNING'
      });
    }
  });

  // Verificar MUI ListItemText específicamente
  const listItemTexts = document.querySelectorAll('[class*="MuiListItemText"]');
  listItemTexts.forEach((el) => {
    const secondaryText = el.querySelector('[class*="MuiListItemText-secondary"]');
    if (secondaryText) {
      const nestedDivs = secondaryText.querySelectorAll('div');
      if (nestedDivs.length > 0 && secondaryText.tagName.toLowerCase() === 'p') {
        issues.push({
          type: 'MUI_LISTITEMTEXT_ISSUE',
          element: el,
          nestedElements: Array.from(nestedDivs),
          message: `ListItemText secondary (${secondaryText.tagName}) contiene ${nestedDivs.length} div(s)`,
          severity: 'ERROR'
        });
      }
    }
  });

  // Mostrar resultados
  if (issues.length === 0) {
    console.log('✅ No se encontraron problemas de anidación HTML');
    console.log('🎉 El código parece estar libre de errores de hydratación relacionados con anidación');
  } else {
    console.log(`❌ Se encontraron ${issues.length} problema(s) de anidación:`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    issues.forEach((issue, index) => {
      const icon = issue.severity === 'ERROR' ? '🚨' : '⚠️';
      console.log(`${icon} ${index + 1}. ${issue.type}: ${issue.message}`);
      console.log('   Elemento problemático:', issue.element);
      
      if (issue.blockElements) {
        console.log('   Elementos de bloque encontrados:', issue.blockElements);
      }
      if (issue.nestedElements) {
        console.log('   Elementos anidados:', issue.nestedElements);
      }
      console.log('');
    });

    console.log('💡 Soluciones recomendadas:');
    console.log('   1. Usar component="div" en Typography cuando sea necesario');
    console.log('   2. Reemplazar Stack/Box con elementos inline en contextos de párrafo');
    console.log('   3. Usar React.Fragment en lugar de elementos contenedores');
    console.log('   4. Agregar secondaryTypographyProps={{ component: "div" }} a ListItemText');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  return {
    totalIssues: issues.length,
    errors: issues.filter(i => i.severity === 'ERROR'),
    warnings: issues.filter(i => i.severity === 'WARNING'),
    details: issues
  };
})();

// Función para monitorear cambios en tiempo real
window.watchHTMLNesting = function() {
  let observer;
  
  const checkAndLog = () => {
    const result = checkHTMLNesting();
    if (result.totalIssues > 0) {
      console.warn(`🔄 Detectados ${result.totalIssues} problemas de anidación después de cambios en el DOM`);
    }
  };

  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver(() => {
    // Debounce para evitar demasiadas verificaciones
    clearTimeout(window.nestingCheckTimeout);
    window.nestingCheckTimeout = setTimeout(checkAndLog, 1000);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });

  console.log('👀 Monitoreo de anidación HTML activado');
  console.log('   Para desactivar: observer.disconnect()');
  
  return observer;
};

console.log('🛠️ FUNCIONES DISPONIBLES:');
console.log('   checkHTMLNesting() - Verificar problemas una vez');
console.log('   watchHTMLNesting() - Monitorear cambios en tiempo real'); 