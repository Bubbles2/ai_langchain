try {
    const langchain = require('langchain');
    console.log('langchain keys:', Object.keys(langchain));
    console.log('MemoryVectorStore in langchain?', !!langchain.MemoryVectorStore);
    if (langchain.MemoryVectorStore) console.log('Found in langchain');
} catch (e) { console.log('langchain require failed:', e.message); }

try {
    const mem = require('langchain/vectorstores/memory');
    console.log('langchain/vectorstores/memory loaded');
} catch (e) { console.log('langchain/vectorstores/memory failed:', e.message); }

try {
    const core = require('@langchain/core/vectorstores/memory');
    console.log('@langchain/core/vectorstores/memory loaded');
} catch (e) {
    console.log('@langchain/core/vectorstores/memory failed:', e.message);
}

try {
    const classic = require('@langchain/classic/vectorstores/memory');
    console.log('@langchain/classic/vectorstores/memory loaded');
} catch (e) {
    console.log('@langchain/classic/vectorstores/memory failed:', e.message);
}
