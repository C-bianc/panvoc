// https://data.iana.org/TLD/tlds-alpha-by-domain.txt
// check email with domain names from the cached list
const fs = require('fs')

const TLD_CACHE_FILE = __dirname + '/domList.txt'

function readCachedTLDListFromFile () {
  try {
    let tldList = fs.readFileSync(TLD_CACHE_FILE, 'utf8') // read fetched domain list
    return tldList

  } catch (error) {
    console.error('Error reading cached TLD list from file:', error)
    return []
  }
}

/*
Pour rappel, une adresse de courrier valide a 4 parties :
- Un identifiant de destinataire ;
- Le symbole @ ;
- Un nom de domaine ;
- Un nom de domaine principal (.com, .net, .be).

Le nom de l’identifiant peut avoir maximum 64 caractères et peut être composé :
- des caractères minuscules et majuscules de l’anglais ;
- de chiffres ;
- de certains caractères de ponctuation. Les plus fréquents sont le plus (+) le point (.) le
caractère de soulignement (_) et le trait d’union (-) ;
- Un caractère de ponctuation ne peut pas apparaitre comme premier ou dernier
caractère de l’adresse ;
- Un point ne peut pas apparaitre deux fois de manière consécutive.

Le format du nom de domaine est de maximum 253 caractères et peut être composé :
- des caractères minuscules et majuscules de l’anglais
- de chiffres
- d’un trait d’union (-)
- d’un point (pour identifier un sous-domaine)
Le nom du domaine principal est une séquence de caractères formant un mot appartenant à
une liste fermée de plus de mille entrées : voir source
 */

let emailPattern

// get dom list (which are joined with operator | in order to use it in the regex)
const domList = readCachedTLDListFromFile()

if (domList.length === 0) {
  // if no domain list (mozilla default
  emailPattern = new RegExp(`^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$`)

} else {
  // use our domain list

  /*
  personal regex for email and use domain names in variable :
  ($email = ~/^[a-zA-Z0-9](?!.*[.!#$%&'*+\\/=?^_\`{|}~-]{2})([a-zA-Z0-9.!#$%&'*+\\/=?^_\`{|}~-]{1,64})(?![.!#$%&'*+\\/=?^_\`{|}~-])@[a-zA-Z0-9.-]{1,253}\.(${domList})$/
   */
  console.log('Using our domain list')
  // reduce 64 to 63 because first character is detected by ^[...]
  const regexPattern = `^[a-zA-Z0-9](?!.*[.!#$%&'*+\\\/=?^_\`{|}~-]{2})([a-zA-Z0-9.!#$%&'*+\\\/=?^_\`{|}~-]{1,63})(?<![.!#$%&'*+\\/=?^_\`{|}~-])@(?![.-])[a-zA-Z0-9.-]{1,253}\.(${domList})$`
  emailPattern = new RegExp(regexPattern)
}

// funct to test email on pattern
function checkValidEmail (email) {
  return emailPattern.test(email)
}

module.exports = { checkValidEmail }
