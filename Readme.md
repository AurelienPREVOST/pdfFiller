# Pdf form builder from no PDF

Attention application non finalisé fonctionnement manuel partiel

1ere etape dans le dossier SSR on lance 

'''
node server.js
'''

on definit l'ensemble des input et on export
en console du navigateur et ou en console du terminal on obtient un JSON avec les fields et les checkbox

a partir de là changement de script:

on va dans le dossier 
'''
cd ../scripts
'''

on voit alors createFillableFormFromFile.js

c'est lui que l'on va executer en lui passant en argument, le chemin du fichier et le json copier coller dans la fonction.

donc une fois chackbox et fields passé : 

'''
node createFillableFormFile.js
'''

PS: le code a été abandoné, je n'y ai plus touché pendant longtemps. Il y a moyen de memoire de le faire fonctionné en automatique mais pour l'heure pas le temps de chercher, ca marche comme ca aussi


