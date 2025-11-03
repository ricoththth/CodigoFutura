import StellarSdk from '@stellar/stellar-sdk';

// Configuración
const horizonServer = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = StellarSdk.Networks.TESTNET;

const SECRET_KEY = 'SDUX7UXXXXXXXXXXEY';
const DESTINATION = 'GA74ICXS227XU5SXFTZXQWNHWCTMUBJM2FCFXDAO3V2KTDH4E7WQWSS5';

async function enviarPago(amount, memo = '') {
  try {
    console.log('🚀 Iniciando pago...\n');
    
    // Paso 1: Cargar tu cuenta
    const sourceKeys = StellarSdk.Keypair.fromSecret(SECRET_KEY);
    const sourceAccount = await horizonServer.loadAccount(sourceKeys.publicKey());
    
    console.log(`Balance actual: ${sourceAccount.balances[0].balance} XLM\n`);
    
    // Paso 2: Construir transacción
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: networkPassphrase
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: DESTINATION,
        asset: StellarSdk.Asset.native(),
        amount: amount.toString()
      }))
      // MEMO CORREGIDO - máximo 28 caracteres y sin emojis
      .addMemo(memo ? StellarSdk.Memo.text(memo.substring(0, 28)) : StellarSdk.Memo.none())
      .setTimeout(30)
      .build();
    
    // Paso 3: Firmar
    transaction.sign(sourceKeys);
    
    // Paso 4: Enviar
    const result = await horizonServer.submitTransaction(transaction);
    
    console.log('🎉 ¡PAGO EXITOSO!\n');
    console.log(`💰 Enviaste: ${amount} XLM`);
    console.log(`🔗 Hash: ${result.hash}\n`);
    console.log(`📝 Memo: ${memo ? memo.substring(0, 28) : 'Ninguno'}\n`);
    
    return result;
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    throw error;
  }
}

// Prueba con un memo válido (máximo 28 caracteres)
enviarPago('25', 'Mi primer pago con codigo');