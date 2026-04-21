# ¿Es un AINE?

## 1. Visión General

Este proyecto consiste en una aplicación web diseñada para ayudar a personas con alergia a los **AINEs (Antiinflamatorios No Esteroideos)** a identificar si un medicamento comercial contiene alguno de estos compuestos en su formulación.

La herramienta nace de la necesidad de detectar "AINEs ocultos" en medicamentos de varios componentes (como antigripales tipo Couldina) que pueden representar un riesgo vital para personas alérgicas.

### Inspiración

- **Referencia:** [e-lactancia.org](https://www.e-lactancia.org/)
- **Concepto clave:** Simplicidad extrema, buscador central y un código de colores intuitivo.

---

## 2. Funcionamiento Lógico

La aplicación actuará como un filtro entre la base de datos oficial de medicamentos y el usuario.

1. **Entrada:** Nombre comercial o principio activo (ej. "Couldina" o "Ibuprofeno").
2. **Consulta Externa:** La app conecta con la **API de CIMA** (Agencia Española de Medicamentos y Productos Sanitarios).
3. **Análisis:** Cruce de la lista de principios activos del producto con una base de datos interna de AINEs conocidos.
4. **Resultado:** Visualización inmediata del riesgo mediante un semáforo visual.

---

## 3. Interfaz de Usuario (UX/UI)

Siguiendo el modelo de éxito de e-lactancia, se propone un sistema de colores:

| Color           | Categoría                | Acción/Mensaje                                                              |
| :-------------- | :----------------------- | :-------------------------------------------------------------------------- |
| 🔴 **Rojo**     | **CONTIENE AINE**        | Alerta crítica. Indica el compuesto detectado (ej. Ácido Acetilsalicílico). |
| 🟢 **Verde**    | **SIN AINE DETECTADO**   | Seguro para alérgicos a AINEs basándose en la composición oficial.          |
| 🟡 **Amarillo** | **DUDOSO / DESCONOCIDO** | Medicamento no encontrado o datos incompletos. Consultar al farmacéutico.   |

---

## 4. Diccionario de Datos (AINEs Comunes)

La "lista negra" inicial debería incluir, entre otros:

- Ibuprofeno
- Ácido Acetilsalicílico (Aspirina)
- Naproxeno
- Diclofenaco
- Dexketoprofeno (Enantyum)
- Indometacina
- Piroxicam

---

## 7. Aviso Legal (Disclaimer)

> **IMPORTANTE:** Esta aplicación es una herramienta informativa basada en datos públicos. No sustituye el consejo de un profesional sanitario. Se recomienda siempre verificar el prospecto físico del medicamento y consultar con un médico o farmacéutico antes de cualquier ingesta, especialmente en casos de alergias severas.
