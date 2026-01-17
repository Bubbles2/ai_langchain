try {
    const mod = require('@langchain/classic/vectorstores/memory');
    console.log('SUCCESS: Loaded @langchain/classic/vectorstores/memory');
    console.log('Exports:', Object.keys(mod));
} catch (e) {
    console.log('FAILURE:', e.message);
}
