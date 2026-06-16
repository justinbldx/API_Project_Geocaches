# API_Project_Geocaches
Répertoire Git contenant les fichiers pour le projet de la matière "API Rest"

### Lancement du projet

Lancer le docker
```bash
docker compose up -d
```

Compiler le projet et le lancer
```bash
npm run build && npm run start
```

### Modele Conceptuel de données
<img width="4032" height="3024" alt="unnamed" src="https://github.com/user-attachments/assets/c285ac5c-6210-436d-b858-52fca25e3161" />

### Modele relationnel de données
<img width="774" height="599" alt="BDD" src="https://github.com/user-attachments/assets/fb721ebd-296e-4015-a18d-1d53d9b5a19e" />

### Lancer l'API en local
Prérequis :
- Avoir une clé SSH Github de configuré sur la machine afin de cloner le répertoire
- Avoir Docker d'installé sur la machine

Cloner le projet github : 
```
git clone https://github.com/justinbldx/API_Project_Geocaches.git
```
Entrer dans le repertoire de travail :
```
cd API_Project_Geocaches/
```
Lancer la base de données à l'aide de Docker
```
docker compose up -d
```



