try {
    const mem = require('langchain/vectorstores/memory');
    console.log('langchain/vectorstores/memory loaded');
} catch (e) {
    console.log('langchain/vectorstores/memory failed');
}

try {
    const community = require('@langchain/community/vectorstores/memory');
    console.log('@langchain/community/vectorstores/memory loaded');
    if (community.MemoryVectorStore) console.log('Found MemoryVectorStore in community');
} catch (e) {
    console.log('@langchain/community/vectorstores/memory failed:', e.message);
}
