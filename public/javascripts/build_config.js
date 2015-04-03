({
    baseUrl: ".",
    // light version of require to include in the build
    name: "./conversejs/components/almond/almond.js",
    // result of the build
    out: "./build/tandoori-chat.min.js",
    // entry point of the app
    include: ['tandoori-chat'],
    // requirejs configuration (same main.js file)
    mainConfigFile: 'require.config.js',
    // pick the converse version here
    paths: {
        "converse-dependencies":  "conversejs/src/deps-no-otr"
    }
})
