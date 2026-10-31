"""Translate the four analysis guides from the French reference, preserving markup."""
from pathlib import Path
import json
import re

root = Path(__file__).resolve().parents[1] / 'src/features/help/content'
names = ['aide_pena', 'aide_energy', 'tuto_pena', 'tuto_energy']
translations = r'''
Calcul des temps de pénalités|||Calculating penalty times
Calcul des pertes et des temps de récupération d'énergie|||Calculating energy loss and recovery times
Tutoriel pénalités|||Penalties tutorial
Tutoriel énergie|||Energy tutorial
Courbe des pénalités|||Penalty curve
Courbe de référence $ f(tws)$|||Reference curve $ f(tws)$
Coefficient multiplicateur de la stamina $ C_{stamina}$|||Stamina multiplier $ C_{stamina}$
Option Enrouleur / Magic Furler $C_{MagicFurler}$|||Furler / Magic Furler option $C_{MagicFurler}$
Pertes d'énergie|||Energy loss
Courbe des pertes d'énergie $ f_p(tws)$|||Energy loss curve $ f_p(tws)$
Coefficient multiplicateur du bateau $C_{bateau}$|||Boat multiplier $C_{bateau}$
Récupération d'énergie|||Energy recovery
Courbe de la récupération $ f_r(tws)$|||Recovery curve $ f_r(tws)$
Vue d'ensemble de la page|||Page overview
Mode Focus|||Focus mode
Mode Grille|||Grid mode
Sélection du bateau|||Boat selection
Sélection des options|||Equipment selection
Pénalités simples|||Simple penalties
Rentabilité d'un changement de voile|||Break-even point of a sail change
Pénalités doubles|||Double penalties
Présentation|||Overview
Fonctionnalités des courbes|||Chart features
Réglages et Calculatrice|||Settings and calculator
Perte d énergie|||Energy loss
Récupération d'énergie|||Energy recovery
Avec :|||Where:
Avec:|||Where:
Comme dans la réalité , les temps de manoeuvres et de changements de voile sont variables dans Virtual Regatta, dépendant de la force du vent et du bateau utilisé.|||As in real sailing, manoeuvre and sail-change times in Virtual Regatta vary with wind strength and boat type.
Sur [cette page](https://virtualregatta.zendesk.com/hc/fr/articles/115001441474) , on retrouve les différents de temps de manoeuvres pour chaque bateau ainsi que la courbe suivante :|||[This page](https://virtualregatta.zendesk.com/hc/fr/articles/115001441474) lists the manoeuvre times for each boat and provides the following curve:
De manière générale , le temps de manoeuvre $T_m$ est égale :|||In general, manoeuvre time $T_m$ is equal to:
au temps minimal de manoeuvre $T_{min}$ si la vitesse du vent (TWS) est inférieure à 10 nds,|||the minimum manoeuvre time $T_{min}$ when True Wind Speed (TWS) is below 10 kts;
au temps maximal de manoeuvre $T_{max}$ si la vitesse du vent (TWS) est supérieure à 30 nds,|||the maximum manoeuvre time $T_{max}$ when True Wind Speed (TWS) is above 30 kts;
au résultat du calcul suivant :|||the result of the following calculation:
$T_m(tws)$ : Temps de manoeuvre|||$T_m(tws)$: manoeuvre time
$T_{min}$ : Temps minimal de manoeuvre|||$T_{min}$: minimum manoeuvre time
$T_{max}$ : Temps maximal de manoeuvre|||$T_{max}$: maximum manoeuvre time
$f(tws)$ : Contribution normalisé de 0 à 100% de la courbe de référence|||$f(tws)$: contribution of the reference curve, normalised from 0 to 100%
$C_{stamina}$ : Coefficient multiplicateur de la stamina de 0,5 à 2|||$C_{stamina}$: stamina multiplier, from 0.5 to 2
$C_{MagicFurler}$ : Coefficient multiplicateur de l option MagicFurler de 0,8 à 1|||$C_{MagicFurler}$: Magic Furler option multiplier, from 0.8 to 1
Le résultat ne peut pas être inférieur à $T_{min}$.|||The result cannot be lower than $T_{min}$.
Grâce à de nombreuses mesures éffectuées dans le jeu et au support de la communauté, la courbe fournie par VR a pu être modélisé avec l équation suivante.|||Measurements taken in the game, with support from the community, made it possible to model the curve supplied by VR using the following equation.
$tws$ : vitesse du vent en nds|||$tws$: True Wind Speed in kts
Comme sur un bateau reel , l état de forme du skipper joue sur le temps nécessaire pour effectuer une manoeuvre.|||As on a real boat, the skipper's fitness affects the time needed to perform a manoeuvre.
C 'est pour tenir compte de cet aspect que Virtual Regatta a introduit l'énergie du skipper ( ou stamina ) comme paramètre.|||Virtual Regatta introduced the skipper's energy, or stamina, to account for this effect.
Sur [cette page](https://virtualregatta.zendesk.com/hc/fr/articles/5402546102546), on peut retrouver les différentes informations relatives à cette fonctionnalité, notamment concernant l impact de l état de forme sur le temps de manoeuvre représenté par cette courbe:|||[This page](https://virtualregatta.zendesk.com/hc/fr/articles/5402546102546) explains this feature, including the effect of fitness on manoeuvre time shown by this curve:
On peut donc calculer le coefficient multiplicateur de la stamina en fonction de l'état de forme du skipper $Energie_{skipper}$ grâce à l équation suivante :|||The stamina multiplier can therefore be calculated from the skipper's fitness $Energie_{skipper}$ using the following equation:
Si l énergie du skipper est supérieure à 100%, elle normalisé à 100% pour ce calcul.|||If the skipper's energy exceeds 100%, it is capped at 100% for this calculation.
En cas de changement si votre bateau est équipé de l'option enrouleur magique ("Magic Furler"), un coefficient de réduction de temps de manoeuvre doit être appliqué.|||For a sail change, if your boat has the Magic Furler option, a manoeuvre-time reduction factor must be applied.
Sinon , on fixe le coefficient à 1,0|||Otherwise, the factor is set to 1.0.
Grâce à ces différentes équations ainsi qu'aux valeurs de références des différentes manoeuvres contenues dans les polaires du jeu, **ITYC.fr** est en mesure de calculer pour chaque 1/10ème de noeuds de vent, la valeur de la pénalité qui sera appliquée pour tous les types de bateaux.|||Using these equations and the manoeuvre reference values contained in the game's polars, **ITYC.fr** calculates the penalty for every boat type at each 0.1-knot wind increment.
Comme dans la réalité , les manoeuvres et de changements de voile sont plus ou moins fatiguant dans Virtual Regatta, dépendant de la force du vent et du bateau utilisé.|||As in real sailing, manoeuvres and sail changes in Virtual Regatta consume different amounts of energy depending on wind strength and boat type.
Sur [cette page](https://virtualregatta.zendesk.com/hc/fr/articles/5402546102546), on peut retrouver les différentes informations relatives à cette fonctionnalité, notamment concernant la consommation d 'énergie ou stamina pour les différents type de manoeuvres.|||[This page](https://virtualregatta.zendesk.com/hc/fr/articles/5402546102546) explains this feature, including energy or stamina consumption for each type of manoeuvre.
Manoeuvre|||Manoeuvre
Taux de pertes|||Loss rate
Virement|||Tack
Empannage|||Gybe
Changement de voile|||Sail change
Bateau|||Boat
Coefficient|||Multiplier
De manière générale , la perte d'énergie $P_e$ est égale :|||In general, energy loss $P_e$ is equal to:
au taux de perte de la maneuvre de base $P_{e_{Base}}$ si la vitesse du vent (TWS) est égale à 0 nds,|||the basic manoeuvre loss rate $P_{e_{Base}}$ when True Wind Speed (TWS) is 0 kts;
$P_{e_{Base}}$ : Taux de perte par défaut de la manoeuvre|||$P_{e_{Base}}$: default manoeuvre loss rate
$f_p(tws)$ : Contribution normalisé de 1 à 2 de la courbe de référence des pertes d'énergie|||$f_p(tws)$: contribution of the energy-loss reference curve, normalised from 1 to 2
$C_{bateau}$ : Coefficient multiplicateur du bateau de 1 à 2|||$C_{bateau}$: boat multiplier, from 1 to 2
L'influence du vent sur la perte d'énergie ou stamina nous est donnée par la courbe suivante:|||The effect of wind on energy or stamina loss is given by the following curve:
Cette courbe peut être décomposé en 4 sections.|||This curve can be divided into four sections.
De 0 à 10 nds|||From 0 to 10 kts
De 10 à 20 nds|||From 10 to 20 kts
De 20 à 30 nds|||From 20 to 30 kts
Supérieur à 30 nds|||Above 30 kts
Comme sur un bateau reel , le type de bateau joue sur le temps nécessaire pour effectuer une manoeuvre.|||As on a real boat, boat type affects the time needed to perform a manoeuvre.
A ce jour , Virtual Regatta n 'a pas officiellement communiqué le coefficient pour chaque bateau.|||Virtual Regatta has not officially published the multiplier for each boat.
Néanmoins, grâce au effort de la communauté, nou savons qu il existe 4 coefficients différents :|||However, thanks to the community's work, we know that there are four different multipliers:
Après essai , le tableau ci dessous semble faire consensus mais ne peut être garanti.|||Based on testing, the table below appears to reflect the consensus, but its values cannot be guaranteed.
Comme dans la réalité , plus les conditions de navigations sont calmes, plus votre skipper va récupérer son énergie rapidement.|||As in real sailing, the calmer the conditions, the faster your skipper recovers energy.
Sur [cette page](https://virtualregatta.zendesk.com/hc/fr/articles/5402546102546), on peut retrouver les différentes informations relatives à cette fonctionnalité, notamment concernant la récupération d 'énergie ou stamina.|||[This page](https://virtualregatta.zendesk.com/hc/fr/articles/5402546102546) explains this feature, including energy or stamina recovery.
L'influence de la force du vent nous est donnée par la courbe suivante :|||The effect of wind strength is given by the following curve:
De manière générale , le temps pour récupérer un 1% d'energie $T_r$ est égale :|||In general, the time $T_r$ needed to recover one percentage point of energy is equal to:
à $T_r{min}$ = 5 min par point si la vitesse du vent (TWS) est égale à 10 nds,|||$T_r{min}$ = 5 minutes per point when True Wind Speed (TWS) is 10 kts;
à $T_r{max}$ = 15 min si la vitesse du vent (TWS) est supérieure à 30 nds,|||$T_r{max}$ = 15 minutes when True Wind Speed (TWS) is above 30 kts;
$T_r(tws)$ : Temps de récupération|||$T_r(tws)$: recovery time
$T_r{min}$ : Temps minimal de récupération|||$T_r{min}$: minimum recovery time
$T_r{max}$ : Temps maximal de récupération|||$T_r{max}$: maximum recovery time
$f_r(tws)$ : Contribution normalisé de 0 à 100% de la courbe de référence|||$f_r(tws)$: contribution of the reference curve, normalised from 0 to 100%
L'influence du vent sur la récupération d'énergie ou stamina nous est donnée par la courbe suivante:|||The effect of wind on energy or stamina recovery is given by the following curve:
On constate que cette courbe a la même allure que la courbe servant de base au calcul des pénalités.|||This curve has the same overall shape as the reference curve used to calculate penalties.
Néanmoins, la courbe a subi une déformation ainsi qu 'un glissement de repère en abscisse.|||However, it has been reshaped and shifted along the horizontal axis.
ITYC se sert donc de la courbe de référence des pénalités en applicant ces transformations .|||ITYC therefore applies these transformations to the penalty reference curve.
Les manoeuvres sont très importantes dans Virtual Regatta et les pénalités qui y sont associées peuvent être conséquentes.|||Manoeuvres are an important part of Virtual Regatta, and the associated penalties can be substantial.
ITYC.fr vous propose cette feuille de calcul permettant de connaître les temps et les distances perdues lors de ces manoeuvres.|||ITYC.fr provides this calculator to show the time and distance lost during these manoeuvres.
Après avoir sélectionné un bateau, les données seront visibles.|||The data is displayed after you select a boat.
*Note : Les paramètres peuvent être modifiés à l'aide du curseur, des flèches de votre clavier, ou saisis directement (séparateur des décimales ',' ou '.')*|||*Note: Adjust settings with the slider or your keyboard arrow keys, or enter values directly (using either ',' or '.' as the decimal separator).*
Sélection du bateau.|||Boat selection.
Sélection des options.|||Equipment selection.
Date mise à jour polaire.|||Polar update date.
Mode affichage.|||Display mode.
ITYC.FR vous permet d afficher les pages sous 2 formes :|||ITYC.FR offers two page layouts:
Mode Focus : une courbe par page , meilleur visibilité.|||Focus mode: one chart per view for better visibility.
Mode Grille : 2 courbe par page, plus compact.|||Grid mode: two charts per view for a more compact layout.
Pénalités simples.|||Simple penalties.
Rentabilité d'une manoeuvre.|||Break-even point of a manoeuvre.
Pénalités doubles.|||Double penalties.
Pénalités simples / Rentabilité d'une manoeuvre.|||Simple penalties / Manoeuvre break-even point.
Vous devez sélectionner le bateau à l'aide de la barre de sélection en haut de la page.|||Select your boat using the selector at the top of the page.
Le type de bateau peut être trouvé dans le jeu sur la page des polaires en haut à gauche.|||In the game, the boat type appears at the top left of the polars page.
Sur les excellents site de [Toxcct by INC](http://inc.bureauvallee.free.fr/polaires/) ou [Toxcct by LSV](https://vro.civis.net/polars), dans la colonne de gauche.|||On the excellent [Toxcct by INC](http://inc.bureauvallee.free.fr/polaires/) or [Toxcct by LSV](https://vro.civis.net/polars) websites, look in the left column.
Sur notre dashboard, onglet Résumé, section Race details Boat Name.|||In our dashboard, open the Summary tab and look under Race details, Boat Name.
Vous devez sélectionner les équipements de votre bateau.|||Select the equipment fitted to your boat.
Activer Winch si votre bateau est équipé des Winch Pro.|||Enable Winch if your boat has Winch Pro.
Activer Enrouleur si votre bateau est équipé du Magic Furler.|||Enable Furler if your boat has Magic Furler.
Activer Veste si votre bateau est équipé du VRtex Jacket.|||Enable Jacket if your boat has the VRtex Jacket.
Activer Coussin si votre bateau est équipé du Confort Lounge.|||Enable Cushion if your boat has the Confort Lounge.
Combien de temps de pénalité sera appliqué en cas de changement de voiles, Combien de distance allez vous perdre dans une manoeuvre ?|||How much penalty time applies to a sail change, and how much distance will you lose during a manoeuvre?
Vous souhaitez connaître si cette manoeuvre sera rentable ?|||Do you want to know whether the manoeuvre will pay off?
Une manoeuvre non voulue, combien vous avez perdu ?|||How much did an unintended manoeuvre cost you?
*Note : Si les paramètres de manoeuvre de l'empannage et du virement sont identiques, les courbes sont fusionnées.*|||*Note: When the tack and gybe manoeuvre parameters are identical, their curves are combined.*
Cette section se divise en 2 parties|||This section has two parts:
Cette section se divise en 2 parties :|||This section has two parts:
Courbe des pénalités pour chaque type de manoeuvre.|||Penalty curve for each manoeuvre type.
Réglage des paramètres de la courbe et calculatrice.|||Chart settings and calculator.
En vert , Temps de pénalités Virement ou empannage|||Green: penalty time for a tack or gybe.
En rouge, Temps de pénalités Changement de voile|||Red: penalty time for a sail change.
Vous pouvez afficher / cacher une courbe en cliquant sur le nom d'une manoeuvre.|||Show or hide a curve by clicking its manoeuvre name.
En maintenant le bouton gauche de votre souris, vous pouvez déplacer la courbe après avoir zoomer.|||After zooming in, hold the left mouse button to pan the chart.
Avec la molette de votre souris, vous pouvez zoomer sur la courbe.|||Use the mouse wheel to zoom in and out of the chart.
Utilisez le bouton 'reset zoom' pour réinitialiser l'affichage.|||Use the 'reset zoom' button to restore the initial view.
Lors du survol du curseur sur la courbe une toolbox comme celle ci apparaît :|||Hover over the curve to display a tooltip like this:
Vitesse du vents ( noeuds ).|||True Wind Speed (knots).
Temps de pénalité appliqué.|||Applied penalty time.
Réglez de l'énergie du skipper (stamina) %.|||Set the skipper's energy (stamina) in %.
Réglez la vitesse du vent (nds).|||Set True Wind Speed (kts).
Obtenez les temps de pénalité pour chaque type de manoeuvre (minutes et secondes).|||Read the penalty time for each manoeuvre type (minutes and seconds).
*Note: Ces données sont identiques à celles fournies pour la courbe.*|||*Note: These values are identical to those shown on the chart.*
Régler la vitesse de votre bateau (nds).|||Set your boat speed (kts).
Obtenez pour chaque type de manoeuvre la distance perdue(miles nautiques).|||Read the distance lost for each manoeuvre type (nautical miles).
Parfois, vous devez changer de voile pendant une heure ou vous devez changer de voile à 2 miles de l'arrivée ? Est - ce utile ?|||Should you change sail for just one hour, or when you are only two miles from the finish? Is it worthwhile?
ITYC.fr vous propose cet outil vous permettant en quelques cliques de répondre à ces questions !!!|||This ITYC.fr tool answers these questions in just a few clicks.
Notez que pour des raisons de performances, la calcul est limité au 12 premières heures.|||For performance reasons, the calculation is limited to the first 12 hours.
Notez que si vous utilisez une terminal trop petit, la courbe ne sera pas affichée.|||On a screen that is too small, the curve will not be displayed.
Courbe de la distance parcourue, avec et sans changement de voile.|||Distance travelled, with and without a sail change.
En vert , distance sans changement de voile|||Green: distance without a sail change.
En bleu, distance avec changement de voile|||Blue: distance with a sail change.
Temps écoulé depuis le début de la manoeuvre en secondes.|||Time elapsed since the start of the manoeuvre, in seconds.
Distance parcourue en miles nautiques.|||Distance travelled in nautical miles.
Obtenez les temps de pénalité  (minutes et secondes).|||Read the penalty time (minutes and seconds).
Vitesse moyenne du bateau sans changement de voile (nds).|||Average boat speed without a sail change (kts).
Vitesse moyenne du bateau avec changement de voile (nds).|||Average boat speed with a sail change (kts).
Temps et distance à partir duquel le changement de voile est rentable,c'est à dire le temps après lequel vous doublerez un bateau n'ayant pas pas changé de voile.|||The time and distance at which the sail change pays off: the point when you overtake a boat that did not change sail.
Il arrive parfois que l'on effectue un changement de voile en même temps qu'un empannage ou un virement .Combien de temps de pénalité sera appliqué ? Quelle distance allez vous perdre ?|||Sometimes a sail change happens at the same time as a gybe or tack. How much penalty time applies, and how much distance will you lose?
En vert , Temps de pénalités Virement ou empannage plus changement de voile.|||Green: penalty time for a tack or gybe combined with a sail change.
Vitesse du vent ( nds ).|||True Wind Speed (kts).
Obtenez la distance perdue.|||Read the distance lost.
Dans Virtual Regatta, comme dans le réel, votre skipper peut être en forme ou fatigué.|||In Virtual Regatta, as in real sailing, your skipper can be fit or tired.
Sa jauge d'énergie ou stamina peut varier de 0 à 100%. Le durée du temps de pénalités est multiplié par un facteur de 0,5 à 2. ( voir [ici](https://ityc.fr/aide_pena.html) pour plus de détails ).|||The energy, or stamina, gauge ranges from 0 to 100%. Penalty duration is multiplied by a factor from 0.5 to 2. (See [here](https://ityc.fr/aide_pena.html) for details.)
ITYC.fr vous propose cette feuille de calcul permettant de calculer les taux de pertes et de récupération d'énergie dépendant des conditions et du bateau.|||ITYC.fr provides this calculator to work out energy loss and recovery rates for your boat and the current conditions.
Perte d énergie lors d une manoeuvre.|||Energy lost during a manoeuvre.
Récupération d énergie|||Energy recovery.
Perte d énergie lors d une manoeuvre / Récupération d énergie.|||Energy lost during a manoeuvre / Energy recovery.
Combien d'énergie allez vous perdre en effectuant une manoeuvre ou un changement de voile ?|||How much energy will you lose when performing a manoeuvre or changing sail?
Combien de temps sera nécessaire pour la récupérer ?|||How long will it take to recover that energy?
Perte d énergie pour chaque type de manoeuvre.|||Energy loss for each manoeuvre type.
En vert , Perte d énergie Virement ou empannage|||Green: energy lost during a tack or gybe.
En rouge, Perte d énergie Changement de voile|||Red: energy lost during a sail change.
Pertes d'énergie.|||Energy loss.
Obtenez le taux d'énergie perdue pour chaque type de manoeuvre (%)|||Read the energy lost for each manoeuvre type (%)
et le temps nécessaire à la récupération de l'énergie perdue.|||and the time needed to recover the lost energy.
Au bout de quelle durée récupérez vous un point d' énergie (stamina) ?|||How long does it take to recover one point of energy (stamina)?
Combien de temps allez vous mettre pour récupérer votre énergie à 100% ?|||How long will it take to restore your energy to 100%?
Durée nécessaire pour récupérer un point d'énergie.|||Time needed to recover one energy point.
En vert , Temps nécessaire par point d'énergie|||Green: time needed per energy point.
Temps nécessaire par point d'énergie.|||Time needed per energy point.
Réglez l énergie (stamina) actuel du skipper (%).|||Set the skipper's current energy (stamina) (%).
Obtenez le taux d'énergie à récupérer (%), le temps nécessaire de récupération|||Read the energy to recover (%), the required recovery time
et le temps de récupération par point d énergie.|||and the recovery time per energy point.
Pénalités Vue d'ensemble|||Penalties page overview
Pénalités Vue d ensemble focus|||Penalties page overview in focus mode
Pénalités Vue d ensemble grille|||Penalties page overview in grid mode
Sélection du bateau ityc|||Boat selection on ITYC
Sélection du bateau game|||Boat selection in the game
Sélection du bateau toxxct|||Boat selection on Toxcct
Sélection du bateau dash|||Boat selection in the dashboard
Pénalités simples focus|||Simple penalties in focus mode
Pénalités simples grille|||Simple penalties in grid mode
Courbe de Pénalités simples|||Simple penalty chart
Pénalité simple tooltip|||Simple penalty tooltip
Calculatrice de pénalité simple|||Simple penalty calculator
courbe rentabilité focus|||Break-even chart in focus mode
courbe rentabilité grille|||Break-even chart in grid mode
Courbe de rentabilité|||Break-even chart
rentabilité tooltip|||Break-even tooltip
Calculatrice de rentabilité|||Break-even calculator
Pénalités double focus|||Double penalties in focus mode
Pénalités double grille|||Double penalties in grid mode
Courbe de Pénalités double|||Double penalty chart
Courbe de pénalité double|||Double penalty chart
Calculatrice de pénalité double|||Double penalty calculator
energie Vue d ensemble focus|||Energy page overview in focus mode
Energie Vue d ensemble grille|||Energy page overview in grid mode
Energie perdue focus|||Energy loss in focus mode
Energie perdue grille|||Energy loss in grid mode
Courbe de energie perdue|||Energy loss chart
pertes d'énergie tooltip|||Energy loss tooltip
Calculatrice energie perdue|||Energy loss calculator
Energie recup grille|||Energy recovery in grid mode
Courbe de energie recup|||Energy recovery chart
énergie recup tooltip|||Energy recovery tooltip
Calculatrice energie recup|||Energy recovery calculator
'''
mapping = dict(line.split('|||', 1) for line in translations.splitlines() if '|||' in line)
pending = set()

def text(value):
    if value in mapping:
        return mapping[value]
    numbered = re.match(r'^(\d+(?:\.\d+)*(?:\.)?\s+)(.*)', value)
    if numbered:
        return numbered[1] + text(numbered[2])
    if not value or re.fullmatch(r'[\d\s.,%|\-:$\\{}()×]+', value) or (value.startswith('$') and value.endswith('$')):
        return value
    if value in ['Figaro 3', 'Class 40', 'Imoca', 'Mini 6.50', 'Ultim (solo)', 'Ultim (crew)', 'Ocean 50', 'Caravelle', 'Super Maxi 100', 'Offshore Racer']:
        return value
    pending.add(value)
    return value

for name in names:
    source = (root / 'fr' / f'{name}.md').read_text(encoding='utf-8')
    destination = []
    formula = False
    for line in source.splitlines():
        stripped = line.strip()
        if stripped == '$$':
            formula = not formula
            destination.append(line)
            continue
        if not stripped or formula or stripped.startswith(('<!--', ':::', '---')):
            destination.append(line)
            continue
        indent = line[:len(line)-len(line.lstrip())]
        if stripped.startswith('!['):
            destination.append(re.sub(r'^!\[([^\]]*)\]', lambda m: '![' + text(m[1]) + ']', line))
        elif stripped.startswith('|'):
            destination.append('| ' + ' | '.join(text(cell.strip()) for cell in stripped.strip('|').split('|')) + ' |')
        else:
            marker = re.match(r'^(#{1,4}\s+|[-*]\s+)(.*)', stripped)
            destination.append(indent + ((marker[1] + text(marker[2])) if marker else text(stripped)))
    (root / 'en' / f'{name}.md').write_text('\n'.join(destination) + '\n', encoding='utf-8')

print(json.dumps(sorted(pending), ensure_ascii=False, indent=2))
