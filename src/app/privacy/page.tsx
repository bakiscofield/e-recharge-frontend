import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité et protection des données',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Politique de Confidentialité
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Introduction
            </h2>
            <p className="leading-relaxed">
              Nous nous engageons à protéger votre vie privée. Cette Politique de
              Confidentialité explique comment nous collectons, utilisons et protégeons
              vos informations lorsque vous utilisez notre Application Web Progressive (PWA).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Informations que nous collectons
            </h2>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-800">2.1 Informations personnelles</h3>
              <p className="leading-relaxed">
                Nous collectons les informations que vous nous fournissez directement, notamment :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Adresse e-mail et numéro de téléphone pour la création de compte</li>
                <li>Historique des transactions (dépôts et retraits)</li>
                <li>Informations de compte bookmaker</li>
                <li>Préférences de profil et paramètres</li>
              </ul>

              <h3 className="font-medium text-gray-800 mt-4">2.2 Informations collectées automatiquement</h3>
              <p className="leading-relaxed">
                Lorsque vous utilisez notre application, nous collectons automatiquement :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Informations sur l&apos;appareil (type de navigateur, système d&apos;exploitation)</li>
                <li>Données d&apos;utilisation (fonctionnalités utilisées, temps passé)</li>
                <li>Données de journal (adresse IP, heures d&apos;accès)</li>
              </ul>

              <h3 className="font-medium text-gray-800 mt-4">2.3 Stockage local</h3>
              <p className="leading-relaxed">
                Notre PWA utilise le stockage local du navigateur et IndexedDB pour :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Permettre les fonctionnalités hors ligne</li>
                <li>Mettre en cache les données pour de meilleures performances</li>
                <li>Stocker les préférences utilisateur</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Comment nous utilisons vos informations
            </h2>
            <p className="leading-relaxed mb-2">
              Nous utilisons les informations collectées pour :
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Fournir et maintenir notre service</li>
              <li>Traiter vos transactions et gérer votre compte</li>
              <li>Envoyer des notifications et mises à jour importantes</li>
              <li>Améliorer notre application et l&apos;expérience utilisateur</li>
              <li>Analyser les tendances d&apos;utilisation pour améliorer les fonctionnalités</li>
              <li>Assurer la sécurité et prévenir la fraude</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Stockage et sécurité des données
            </h2>
            <p className="leading-relaxed">
              Nous mettons en œuvre des mesures de sécurité conformes aux normes de l&apos;industrie pour protéger vos données :
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Toutes les transmissions de données sont cryptées via HTTPS/TLS</li>
              <li>Les mots de passe sont hachés à l&apos;aide d&apos;algorithmes sécurisés</li>
              <li>Audits de sécurité réguliers et mises à jour</li>
              <li>Accès restreint aux informations personnelles</li>
            </ul>
            <p className="leading-relaxed mt-3">
              <strong>Emplacement des données :</strong> Vos données sont stockées sur des serveurs
              sécurisés et peuvent être sauvegardées localement sur votre appareil pour un accès hors ligne.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Partage et divulgation des données
            </h2>
            <p className="leading-relaxed mb-2">
              Nous ne vendons, n&apos;échangeons ni ne louons vos informations personnelles.
              Nous pouvons partager vos informations uniquement dans les circonstances suivantes :
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Avec votre consentement :</strong> Lorsque vous nous autorisez explicitement</li>
              <li><strong>Exigences légales :</strong> Lorsque la loi ou une procédure judiciaire l&apos;exige</li>
              <li><strong>Prestataires de services :</strong> Avec des partenaires de confiance qui aident à exploiter notre service (sous accord de confidentialité strict)</li>
              <li><strong>Transferts d&apos;entreprise :</strong> En cas de fusion ou d&apos;acquisition</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Vos droits et choix
            </h2>
            <p className="leading-relaxed mb-2">
              Vous disposez des droits suivants concernant vos données :
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Accès :</strong> Demander une copie de vos données personnelles</li>
              <li><strong>Rectification :</strong> Mettre à jour ou corriger les informations inexactes</li>
              <li><strong>Suppression :</strong> Demander la suppression de votre compte et de vos données</li>
              <li><strong>Exportation :</strong> Télécharger vos données dans un format portable</li>
              <li><strong>Désinscription :</strong> Se désabonner des notifications</li>
            </ul>
            <p className="leading-relaxed mt-3">
              Pour exercer ces droits, contactez-nous via notre support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Cookies et suivi
            </h2>
            <p className="leading-relaxed">
              Notre application utilise :
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Cookies essentiels :</strong> Requis pour l&apos;authentification et les fonctionnalités de base</li>
              <li><strong>Service Worker :</strong> Permet les fonctionnalités hors ligne et la mise en cache</li>
              <li><strong>Stockage local :</strong> Stocke les préférences et les données en cache</li>
            </ul>
            <p className="leading-relaxed mt-3">
              Nous n&apos;utilisons pas de cookies de suivi tiers ni d&apos;analyses sans votre consentement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Protection des mineurs
            </h2>
            <p className="leading-relaxed">
              Notre application n&apos;est pas destinée aux utilisateurs de moins de 18 ans.
              Nous ne collectons pas sciemment d&apos;informations personnelles auprès de mineurs.
              Si vous pensez que nous avons collecté des informations d&apos;un mineur,
              veuillez nous contacter immédiatement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Transferts internationaux de données
            </h2>
            <p className="leading-relaxed">
              Vos informations peuvent être transférées et traitées dans des pays autres que
              votre pays de résidence. Nous veillons à ce que ces transferts soient conformes
              aux lois applicables sur la protection des données et mettons en œuvre les
              garanties appropriées.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              10. Modifications de cette politique
            </h2>
            <p className="leading-relaxed">
              Nous pouvons mettre à jour cette Politique de Confidentialité de temps en temps.
              Nous vous informerons des changements significatifs en publiant la nouvelle
              politique sur cette page et en mettant à jour la date de &quot;Dernière mise à jour&quot;.
              Votre utilisation continue de l&apos;application après les modifications constitue
              une acceptation de la politique mise à jour.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              11. Nous contacter
            </h2>
            <p className="leading-relaxed">
              Si vous avez des questions ou des préoccupations concernant cette Politique
              de Confidentialité ou nos pratiques en matière de données, veuillez nous
              contacter via notre service support accessible depuis l&apos;application.
            </p>
          </section>

          <section className="border-t pt-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Conformité RGPD (Utilisateurs UE)
            </h2>
            <p className="leading-relaxed mb-2">
              Pour les utilisateurs de l&apos;Union Européenne, nous nous conformons au
              Règlement Général sur la Protection des Données (RGPD). Cela inclut :
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Base légale du traitement (consentement, contrat, intérêt légitime)</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit à l&apos;effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit d&apos;opposition au traitement</li>
              <li>Notification des violations de données dans les 72 heures</li>
            </ul>
            <p className="leading-relaxed mt-3">
              Pour déposer une plainte auprès d&apos;une autorité de contrôle, contactez
              votre autorité locale de protection des données.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t text-center">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Retour à l&apos;accueil
          </a>
        </div>
      </div>
    </div>
  );
}
