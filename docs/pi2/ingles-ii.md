# WattCerto | Project Summary (English II)

**Course:** Systems Analysis and Development, Fatec Antônio Russo, São Caetano do Sul, Brazil
**Teacher:** Margareth | **Team:** Henrique Folhasi, Guilherme Cerqueira, João Pedro, Miguel Essien and Pedro Accorsi

## Abstract

WattCerto is a free web application that helps Brazilian families understand where their electricity bill goes. The user lists the appliances at home (shower, refrigerator, washing machine, lights, air conditioner and others), types in how long each one is used, and the site calculates the monthly consumption in kilowatt-hours (kWh) and the cost in Brazilian reais (R$). The result ranks the appliances from the most expensive to the cheapest and shows the share of each one in the bill. The user can also compare the estimate with the real bill and simulate replacing an appliance with a more efficient model to see the savings per month and per year.

The main points of the project are:

- **Reliable numbers.** Every default value comes from an official source, such as Procel (the Brazilian energy-efficiency program) or ANEEL (the national electricity regulator), or is clearly marked as a typical market value.
- **Privacy by design.** There is no sign-up and no login. The household data stays in the user's browser and is never sent to a server. The only personal data the team stores is the name and e-mail of people who use the contact form, with consent and a deletion date.
- **Accessibility.** The site follows WCAG 2.1 level AA: keyboard navigation, readable fonts, sufficient contrast, and consumption levels shown by color and by text, so color-blind users are not left out.
- **Architecture.** The website is static (HTML, CSS and JavaScript) and is hosted on Netlify. Behind it, a Python program loads CSV and JSON files into a MySQL database, manages the appliance catalog and exports the JSON file that the calculator reads.

The project is connected to social and environmental sustainability: in Brazil, households use almost one third of all electricity (31.7% in 2025, according to EPE), so small changes in many homes add up.

## Critical analysis: should WattCerto have an English version?

Today the site exists only in Brazilian Portuguese, and we believe this is the right choice for now. The target audience is Brazilian families, and the content depends on Brazilian rules: tariff flags set by ANEEL, the Enel São Paulo tariff, prices in reais and the Procel/Inmetro labels. A direct translation would not help a family in another country, because their tariffs, voltage and energy rules are different. Translating would also double the work of keeping every number and source up to date.

However, an English version has real benefits. It would make the project visible to international recruiters and universities, and it would help foreign residents in Brazil who do not read Portuguese well. The code is already prepared for this: every page declares its language (`lang="pt-BR"`), and the calculation rules are separated from the text.

Our recommendation is a gradual approach: first, an English summary page and an English README in the repository (low cost, high visibility); later, if there is demand, a full English version of the calculator for foreigners living in Brazil, keeping reais and Brazilian tariffs. A version for other countries would be a different product, with local data and sources.
