const apiKey = "AIzaSyApoEdbCzfNk4IJo3W8awmBhnKijcx-A18";
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

export async function convertImageToMarkdown(base64ImageData, fileMimeType) {
    const prompt = `Tu tarea es ser un transcriptor y editor contextual de alta precisión. Convierte el texto manuscrito a texto digital Markdown, limpio, corregido y gramaticalmente coherente. Sigue estas reglas de forma OBLIGATORIA:
1.  **Transcripción y Corrección Ortográfica:** Primero, transcribe el texto. Después, corrige CUALQUIER error ortográfico.
2.  **Coherencia Gramatical:** Lee el texto completo para entender el contexto y úsalo para corregir errores gramaticales.
3.  **Unión de Líneas:** Las líneas que continúan una misma frase deben unirse.
4.  **Párrafos:** Usa un único salto de línea doble para separar párrafos.
5.  **Sin Contenido Extra:** Tu respuesta debe contener ÚNICAMENTE el texto final.
6.  **Texto Ilegible:** Si una parte es ilegible, usa la etiqueta \`[ilegible]\`.`;

    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }, { inlineData: { mimeType: fileMimeType, data: base64ImageData } }] }]
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Error en la API: ${response.statusText}`);
    }
    return response.json();
}