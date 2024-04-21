function calculateAverage(data, n) {
    const result = {};
    for (const key in data) {
        result[key] = [];
        for (let i = 0; i < data[key].length; i += n) {
            if (key === "start_Time") {
                // Push the value without calculating the average
                result[key].push(data[key][i]);
            } else {
                const values = data[key].slice(i, i + n);
                const sum = values.reduce((acc, val) => acc + val, 0);
                const average = Math.floor(sum / Math.min(n, values.length)); // Convert average to integer
                result[key].push(average);
            }
        }
    }
    return result;
}

const Response =
{
  "open": [
    350,
    286.3,
    274.2,
    259.2,
    245.5,
    245.3,
    238.8,
    239.05,
    250.6,
    250,
    248.25,
    241.4,
    240.1,
    238.25,
    241.1,
    249.4,
    240.2,
    239.45,
    233.55,
    231.25,
    226.15,
    216.7,
    218.95,
    231.05,
    226,
    228.35,
    235.9,
    242.3,
    244.35,
    264.35,
    248.4,
    229.3,
    240.95,
    253.1,
    249.75,
    250.7,
    244.4,
    247.05,
    235.8,
    227.5,
    235.25,
    221.95,
    209.35,
    213.3,
    214.9,
    210.8,
    218.5,
    219.05,
    219.9,
    220.35,
    225.5,
    232.5,
    234.45,
    230.7,
    221,
    225.4,
    225.55,
    219.1,
    215.2,
    213.95,
    215.75,
    216.1,
    212.85,
    217.55,
    216.7,
    210.35,
    217.4,
    230.55,
    223,
    199.2,
    207,
    212.65,
    212.85,
    209.75,
    211.05,
    204.2,
    212.25,
    209.4,
    210,
    206.75,
    204.1,
    203.6,
    201.85,
    200.6,
    203.8,
    206.9,
    205.3,
    200,
    195.8,
    204.55,
    205.15,
    209.25,
    211.6,
    211.2,
    212.65,
    212.3,
    206.85,
    205.05,
    201.6,
    201.25,
    206,
    211.15,
    214.05,
    209,
    209.6,
    205.9,
    210.05,
    208.65,
    209.75,
    216.35,
    223.05,
    221.85,
    224.45,
    221.7,
    218.8,
    224.55,
    224.55,
    215.3,
    205.5,
    205.1,
    202.5,
    198.25,
    200,
    200.45,
    200.3,
    204.35,
    203.85,
    200.45,
    202.1,
    203.8,
    204.85,
    207.7,
    202.8,
    205.4,
    201.1,
    201,
    199.7,
    199.7,
    201.1,
    204,
    201.55,
    203.8,
    201.65,
    203.15,
    198.4,
    202.4,
    202.45,
    201,
    203.25,
    207.65,
    201.85,
    202.2,
    204.3,
    201.5,
    203.6,
    202.4,
    204.45,
    201.2,
    200.75,
    197.55,
    199.6,
    198.4,
    187.6,
    191.7,
    190,
    192.6,
    192.55,
    190.8,
    194.5,
    193.1,
    194.25,
    192.1,
    192.55,
    193.35,
    195.7,
    194,
    193.25,
    192.15,
    195.2,
    196.4,
    200.95,
    200.7,
    203.15,
    205.15,
    202.55,
    197.9,
    195.85,
    192.25,
    190.6,
    190.1,
    189.65,
    193.15,
    192.85,
    190.9,
    190.2,
    193.05,
    194.55,
    193.2,
    191.6,
    191.75,
    193.4,
    194.15,
    192.25,
    193.3,
    195.75,
    195.7,
    195.7,
    188,
    188.05,
    190,
    193.3,
    195.05,
    196,
    198,
    197.85,
    198.3,
    202.05,
    212.55,
    207.3,
    208.7,
    218.2,
    208.9,
    208.8,
    210.5,
    207.85,
    202.4,
    205,
    207,
    203.4,
    206.1,
    204.65,
    217.5,
    219.45,
    228.65,
    218.8,
    219.4,
    218.55,
    207.45,
    211.8,
    213.75,
    212.55,
    209.45,
    206.5,
    191.5,
    193.75,
    190.45,
    193.45,
    197,
    200.25,
    202,
    200.55,
    196.2,
    197.8,
    199.95,
    199.95,
    193.2,
    178.6,
    180.05,
    184.05,
    187.7,
    184.7,
    184.9,
    184.55,
    187.65,
    188.75,
    179.15,
    187.85,
    188.9,
    189.95,
    190.85,
    185.65,
    189.85,
    190.55,
    187.35,
    191.4,
    186.4,
    188,
    202.15,
    197.1,
    195.15,
    196.95,
    196,
    195.6,
    194.9,
    197.05,
    202.5,
    200.5,
    198.8,
    198.65,
    198.5,
    186.7,
    190.2,
    184.8,
    186.75,
    185.15,
    189.5,
    193.65,
    193.6,
    188.4,
    186.6,
    193.65,
    191.35,
    190.25,
    192.1,
    193,
    193.35,
    194.95,
    191.2,
    194.05,
    199.05,
    200.2,
    195.2,
    189,
    189.8,
    189,
    191.6,
    194.75,
    192.35,
    192.3,
    193.9,
    195.9,
    199.75,
    196.4,
    188.2,
    186.9,
    187.25,
    189.4,
    196.2,
    192,
    194.6,
    200,
    194.3,
    191,
    189.7,
    189.2,
    190.45,
    188.85,
    191,
    183.7,
    188.45,
    187.4,
    188.6,
    188.25,
    191,
    190.25,
    183.9,
    185.5,
    182.55,
    182.9,
    183.85,
    188.85,
    191.5,
    193.3,
    197.65,
    194.4,
    195.4,
    193.6,
    191.75,
    188.8,
    189.8,
    182.05,
    166.15,
    172.85,
    171.45,
    168.2,
    170,
    170.65,
    171.9,
    172,
    171.1,
    166.7,
    169.1,
    166.1,
    166,
    163.7
  ],
  "high": [
    355.5,
    291.9,
    275.7,
    260.85,
    248.55,
    248.45,
    242.8,
    251.4,
    251.3,
    250.3,
    251.8,
    242.65,
    244.45,
    245.6,
    251.65,
    254.9,
    243.5,
    242.15,
    235.25,
    233.4,
    226.15,
    220.15,
    230.45,
    232.15,
    230.5,
    240,
    244,
    244.15,
    270.5,
    265.65,
    249.6,
    241.05,
    256.9,
    254.05,
    254.3,
    250.7,
    254.65,
    247.05,
    236.5,
    236,
    239.7,
    221.95,
    215.5,
    217.75,
    214.9,
    224.4,
    223.55,
    220.55,
    220,
    230.55,
    229.95,
    239.5,
    236.15,
    230.7,
    227.25,
    229.55,
    226.4,
    222,
    216.2,
    222.05,
    219.6,
    218.95,
    217.9,
    217.55,
    219.45,
    218.9,
    238.6,
    234.95,
    223,
    208,
    213.6,
    215.3,
    214.25,
    210.75,
    211.05,
    212.4,
    212.45,
    214.25,
    216.65,
    209.5,
    206,
    203.6,
    204.5,
    205.9,
    212.55,
    211.05,
    205.35,
    203.85,
    207.5,
    208.55,
    211.6,
    217,
    215.5,
    215.35,
    214.6,
    214.7,
    207.75,
    209.15,
    206.55,
    207.4,
    211.8,
    215.85,
    214.05,
    214,
    209.65,
    215.15,
    215,
    211,
    220.95,
    227,
    235.55,
    225.75,
    224.5,
    221.85,
    224,
    226.55,
    226,
    216.15,
    209.35,
    208.75,
    202.85,
    202.7,
    202.45,
    201.1,
    205.6,
    206.9,
    205.6,
    204.45,
    204.4,
    205.85,
    208.55,
    211.9,
    208,
    207.1,
    204.2,
    202.15,
    202.55,
    203.5,
    204.65,
    204,
    204.45,
    205.15,
    206.6,
    205.5,
    203.7,
    204,
    203.6,
    203.35,
    208.5,
    208.35,
    204.95,
    205.7,
    206.35,
    206,
    206.75,
    205.95,
    205.2,
    203.7,
    203.85,
    200.9,
    201.4,
    199.4,
    191.6,
    198.9,
    194,
    195.6,
    193.5,
    195.3,
    197.2,
    196.95,
    196.35,
    194.4,
    193.85,
    196.9,
    195.7,
    195.65,
    194.9,
    196.25,
    199.6,
    201.25,
    205.4,
    204.7,
    207.8,
    205.4,
    202.55,
    200.05,
    196.5,
    194.95,
    191.7,
    193.2,
    194.25,
    194.4,
    193.1,
    191.25,
    193.75,
    195.65,
    195.4,
    193.55,
    192.6,
    193.75,
    194.55,
    195,
    193.45,
    195.75,
    196.75,
    197.05,
    195.7,
    190.95,
    190,
    193.8,
    195.7,
    199.6,
    199.4,
    199,
    201.05,
    202.75,
    211.95,
    215.4,
    210.65,
    219.1,
    224.8,
    212.35,
    213.7,
    211.85,
    207.85,
    206.9,
    208.3,
    207,
    206.4,
    206.1,
    221.95,
    224,
    234.65,
    229.75,
    222,
    222.75,
    219.4,
    215.05,
    215.45,
    214.8,
    214,
    210.9,
    206.6,
    196.65,
    195.3,
    194.6,
    198.85,
    199.75,
    204,
    202,
    201.5,
    198.65,
    200.95,
    201.5,
    201,
    193.6,
    182.85,
    184.35,
    188.9,
    188.65,
    186.4,
    187.25,
    190.2,
    190,
    189,
    188.15,
    189.85,
    190.55,
    190.5,
    190.85,
    190.55,
    193.7,
    192.75,
    192,
    192.8,
    190.85,
    202.6,
    205.3,
    201.25,
    196.9,
    199.2,
    197,
    197,
    198.35,
    202.3,
    202.55,
    203.2,
    203.6,
    201.9,
    199,
    190.45,
    191.15,
    186.2,
    186.85,
    189.45,
    194.4,
    195.6,
    195.3,
    188.45,
    193.6,
    194.6,
    193.7,
    192.25,
    193.45,
    197.1,
    196.15,
    194.95,
    194.95,
    202.45,
    200.35,
    200.2,
    198.1,
    192.65,
    190.85,
    193.3,
    194.95,
    195.5,
    193.5,
    196,
    196.15,
    202.75,
    200.45,
    199.55,
    190.35,
    188.65,
    189.85,
    196.8,
    196.2,
    199.45,
    199.95,
    200,
    194.4,
    191.85,
    192.9,
    190.55,
    191.8,
    193.85,
    191.5,
    187.95,
    189.8,
    189.5,
    191.85,
    191.1,
    192.95,
    190.4,
    188.7,
    187.4,
    184.65,
    184.1,
    189.75,
    194.1,
    194.05,
    198.95,
    198.85,
    197.65,
    197.9,
    195.55,
    191.75,
    191.05,
    190,
    184.6,
    176.1,
    173.55,
    171.45,
    171.85,
    171.45,
    171.55,
    172,
    172.65,
    171.85,
    169.9,
    169.35,
    166.1,
    166,
    164.65
  ],
  "low": [
    287.1,
    270.3,
    261.5,
    245.2,
    241.45,
    237.25,
    235.4,
    237.35,
    246.4,
    242.7,
    241.3,
    235.7,
    236.25,
    235.75,
    239.65,
    239.4,
    235.5,
    225.9,
    228.25,
    226.3,
    215.15,
    211.8,
    216,
    222,
    220.65,
    225.7,
    230.8,
    232,
    244.35,
    244.4,
    230.85,
    229.3,
    240.95,
    240.95,
    244.25,
    243.3,
    242.8,
    235.5,
    223.2,
    227.5,
    218.9,
    204.25,
    209.35,
    210.6,
    209,
    209.2,
    217.25,
    213.2,
    214.8,
    218.25,
    223,
    225.65,
    230,
    219.8,
    218.35,
    222.55,
    216.15,
    213.75,
    211.25,
    213.45,
    215,
    212.45,
    209.45,
    213.35,
    209.9,
    208.35,
    216.55,
    222.5,
    192.2,
    199.2,
    205.25,
    207.85,
    207.9,
    206.35,
    201.75,
    201.45,
    207,
    209.25,
    207.2,
    203.2,
    198.05,
    195.7,
    198.5,
    200.6,
    203.8,
    204.35,
    200,
    195.8,
    195.8,
    203.45,
    202.9,
    208.65,
    208.95,
    210,
    208,
    205.95,
    199.4,
    202,
    200.35,
    200.65,
    205.05,
    209.7,
    207.7,
    208.55,
    205,
    205,
    209.25,
    206.25,
    208.35,
    214.4,
    218.8,
    215.45,
    217.55,
    218,
    218.4,
    219.3,
    211.5,
    198.9,
    203.6,
    202.75,
    196.05,
    197.6,
    198.25,
    197.85,
    199,
    202.25,
    199.55,
    200.4,
    201.85,
    201.6,
    200.45,
    203,
    202.2,
    201.6,
    200.55,
    196.1,
    199.05,
    199.3,
    199.7,
    200.35,
    200.05,
    200.4,
    201.65,
    198.1,
    197.6,
    201.35,
    200.3,
    199.7,
    202.3,
    201.65,
    201,
    200.9,
    201.1,
    201.5,
    202.5,
    200.65,
    201.45,
    200.55,
    197.6,
    197.1,
    198.7,
    183.6,
    182.8,
    190.2,
    190,
    190.8,
    189.5,
    190.05,
    193.2,
    193.1,
    191.95,
    190.9,
    190.25,
    193.35,
    192.8,
    189.9,
    190.7,
    192.15,
    191.4,
    195.1,
    199.5,
    197.75,
    202.9,
    201.5,
    198.1,
    195.45,
    190.7,
    190.35,
    186.65,
    189.95,
    188.4,
    192.25,
    190.05,
    188.85,
    189.8,
    192.6,
    192.3,
    188.8,
    190.6,
    191.2,
    191.8,
    190.5,
    191.15,
    192.3,
    194.25,
    195,
    188.7,
    185.8,
    186.95,
    189.75,
    193.3,
    194.85,
    195.4,
    193.75,
    197.25,
    198.25,
    201.2,
    203.85,
    203.95,
    208.4,
    208.1,
    204.05,
    207.75,
    205.15,
    198.65,
    198.2,
    201.85,
    200.9,
    202.35,
    202.3,
    204.65,
    217.25,
    219.1,
    218.7,
    216.2,
    214.3,
    207.1,
    207.45,
    210.4,
    210.6,
    207.6,
    202.15,
    194.3,
    189.95,
    190.3,
    190.35,
    193.45,
    195.75,
    200.25,
    195.25,
    195.4,
    195.35,
    197.4,
    198,
    193,
    173.8,
    174.95,
    176.95,
    183.6,
    182.95,
    183.45,
    183.2,
    184.4,
    186.75,
    181.6,
    179.15,
    185.55,
    186.6,
    187,
    185,
    185.15,
    187.6,
    186.8,
    187.35,
    184.25,
    186.4,
    187.55,
    196.65,
    195,
    192.05,
    194.75,
    194.8,
    192.75,
    194.85,
    196.25,
    196.85,
    198.6,
    198.4,
    197.65,
    184.95,
    186.4,
    182.05,
    181.9,
    182.9,
    184.85,
    188.8,
    192,
    188.6,
    184.3,
    186.6,
    190.95,
    190,
    187.55,
    191.15,
    192.5,
    193.2,
    189.15,
    191,
    194.05,
    195.95,
    195.5,
    187.85,
    189,
    187,
    189,
    190.9,
    192,
    190.75,
    191.7,
    192,
    195.35,
    196,
    187.55,
    181.2,
    185.45,
    184.55,
    189,
    190.7,
    192,
    194.25,
    193.85,
    190.25,
    187.9,
    189,
    186.05,
    188.35,
    188.85,
    184,
    183.7,
    184.7,
    186.35,
    188.1,
    187.45,
    188.75,
    176.45,
    183.35,
    178.8,
    179.75,
    180.85,
    183.3,
    188.35,
    189.95,
    193.3,
    192.8,
    193.4,
    191.6,
    189.25,
    188.55,
    187.15,
    180.5,
    166.25,
    164.75,
    168.45,
    166.8,
    168.2,
    167.55,
    169.25,
    167.15,
    170.65,
    164.9,
    166.7,
    165,
    162.5,
    161.35,
    158.4
  ],
  "close": [
    290.6,
    274.85,
    261.7,
    245.2,
    243.05,
    240.1,
    240.35,
    250.7,
    249.05,
    248.3,
    241.3,
    239.85,
    237.85,
    239.25,
    246.7,
    240.55,
    239.95,
    232.1,
    233,
    226.3,
    217.05,
    217.85,
    230.45,
    225.2,
    228.1,
    234.8,
    241.85,
    242.95,
    263.6,
    249,
    230.85,
    240.6,
    255.05,
    249.5,
    251.6,
    244.75,
    246.45,
    235.5,
    229.9,
    236,
    218.9,
    209.85,
    213.3,
    213.2,
    210.75,
    217.65,
    218.7,
    219.75,
    219.65,
    227.4,
    229.5,
    233.25,
    231.85,
    221.5,
    224.9,
    226.3,
    221.3,
    215,
    214.15,
    215.6,
    217,
    213.45,
    216.8,
    217.05,
    210.65,
    217.4,
    230.5,
    222.5,
    199.55,
    207.65,
    212.7,
    211.8,
    210,
    210.6,
    205,
    211.3,
    209,
    211.7,
    207.7,
    204.1,
    204.3,
    201.35,
    200.45,
    204.45,
    208.8,
    204.35,
    200.5,
    195.8,
    205.45,
    205.45,
    209.75,
    211.85,
    212.65,
    212,
    212.95,
    207.3,
    205.8,
    202.1,
    201.6,
    205.9,
    211.25,
    213.9,
    208.75,
    209.9,
    206.3,
    210.1,
    209.25,
    209.15,
    215.35,
    220.25,
    221.65,
    223.85,
    221.4,
    219,
    224,
    224.4,
    214.95,
    205.3,
    205.65,
    202.75,
    198.65,
    200.05,
    200.35,
    198.95,
    204.5,
    203.45,
    201.05,
    201.95,
    203.85,
    205.15,
    207.15,
    203.2,
    206,
    201.6,
    201.55,
    198.25,
    199.05,
    200.95,
    203.35,
    200.95,
    202.5,
    201.7,
    202.1,
    198.1,
    202.85,
    202.95,
    201.05,
    202.55,
    207.45,
    202.35,
    202.6,
    204.1,
    201.65,
    203.35,
    202.5,
    204.95,
    201.45,
    200.85,
    197.6,
    199.9,
    199.2,
    187.65,
    191.6,
    190.2,
    193.1,
    192.65,
    190.7,
    194.2,
    193.2,
    194.4,
    191.95,
    192.3,
    193.45,
    195.4,
    194.3,
    193.7,
    191.95,
    196.25,
    197.7,
    200.4,
    200.35,
    203.8,
    204.5,
    202.55,
    198.25,
    195.7,
    192.6,
    191.3,
    191,
    190.7,
    192.8,
    193.25,
    191,
    190,
    193.3,
    194.85,
    193.15,
    191.65,
    191.6,
    193.5,
    194.55,
    192.9,
    193.4,
    195.75,
    195.05,
    195,
    188.7,
    188.1,
    190,
    193.55,
    194.8,
    196.7,
    197.7,
    197.35,
    198.7,
    202.75,
    211.95,
    207,
    208.85,
    218.55,
    209.9,
    208.8,
    210.2,
    208.6,
    202.55,
    204.15,
    207.15,
    204.3,
    206.35,
    204.6,
    215.25,
    218.2,
    226.5,
    218.95,
    219.5,
    219.7,
    209.55,
    211.4,
    213.75,
    212.95,
    209.6,
    206.65,
    194.3,
    192.9,
    190.4,
    194,
    198,
    199.75,
    202.2,
    200.4,
    197.6,
    198.6,
    200,
    199.8,
    194.45,
    180.3,
    179.5,
    184.35,
    187.2,
    185.5,
    185.3,
    184.1,
    187.45,
    188.55,
    181.8,
    187.65,
    188.8,
    190,
    190,
    185.7,
    189.75,
    190.55,
    186.8,
    192,
    184.9,
    188.2,
    200,
    196.65,
    195.65,
    196.9,
    196,
    195.85,
    194.6,
    198,
    201.4,
    199.9,
    198.6,
    199.1,
    198,
    184.95,
    190.1,
    184.4,
    186.2,
    185,
    188.85,
    193.3,
    193.2,
    188.6,
    187,
    192.6,
    192.25,
    190,
    191.7,
    193.4,
    193.75,
    194.75,
    191.65,
    193.6,
    198.7,
    199.75,
    196,
    189.05,
    189.8,
    189.05,
    191.35,
    194.8,
    192.1,
    192.45,
    195.1,
    195.9,
    198.4,
    196,
    189,
    186.35,
    187.35,
    189.85,
    196.35,
    193.05,
    194.65,
    199.9,
    194.1,
    191.3,
    190.05,
    189.75,
    190.4,
    189.3,
    192.25,
    184.35,
    187.15,
    187,
    188.7,
    189.35,
    190.7,
    190.2,
    184.4,
    185.4,
    184.1,
    182.95,
    184.1,
    188,
    191.35,
    192.5,
    198.1,
    194.9,
    195,
    192.05,
    192.1,
    188.55,
    189.45,
    180.5,
    166.25,
    172.65,
    171.9,
    168.35,
    169,
    170.2,
    171.45,
    171.95,
    171.1,
    166.4,
    168.35,
    165,
    164.55,
    163,
    161.85
  ],
  "volume": [
    320265,
    346500,
    300165,
    322575,
    221970,
    234045,
    174360,
    232170,
    198615,
    151665,
    182070,
    183345,
    121770,
    112410,
    258165,
    244995,
    160920,
    273930,
    130515,
    92805,
    283830,
    157710,
    221880,
    156345,
    119280,
    265995,
    330435,
    297945,
    1009965,
    419370,
    423915,
    258495,
    462060,
    209430,
    179130,
    154725,
    223305,
    215415,
    401295,
    165165,
    264135,
    472995,
    150405,
    131055,
    135885,
    327900,
    182865,
    197355,
    107775,
    259860,
    216780,
    375525,
    169305,
    167340,
    138000,
    114000,
    181185,
    189810,
    125565,
    124155,
    70515,
    94995,
    119445,
    65310,
    181110,
    169725,
    469005,
    200190,
    596910,
    215160,
    195240,
    130095,
    88875,
    82230,
    123270,
    134490,
    115410,
    108735,
    140880,
    129975,
    199515,
    217725,
    232590,
    89835,
    201480,
    242835,
    120435,
    136755,
    124065,
    92190,
    137670,
    211440,
    152415,
    90000,
    89475,
    123810,
    196350,
    90660,
    89580,
    75315,
    73650,
    178755,
    108555,
    81285,
    72720,
    150480,
    133320,
    69240,
    194670,
    303435,
    445920,
    210675,
    168990,
    112635,
    149325,
    249555,
    320850,
    411075,
    158910,
    98700,
    277575,
    132885,
    76140,
    92115,
    128670,
    114135,
    79500,
    53340,
    50775,
    71550,
    107010,
    177120,
    74055,
    95100,
    81180,
    141645,
    75285,
    59865,
    59070,
    32445,
    49275,
    66090,
    78795,
    95550,
    56940,
    70335,
    46740,
    68205,
    98745,
    124740,
    73785,
    53850,
    56565,
    48630,
    44220,
    79500,
    38295,
    40320,
    108120,
    67965,
    40590,
    391815,
    200805,
    215340,
    76125,
    85635,
    71700,
    77970,
    109965,
    49905,
    55350,
    62850,
    62805,
    90210,
    43635,
    69855,
    38805,
    75240,
    93105,
    141000,
    239655,
    105225,
    190200,
    87690,
    90495,
    90420,
    160995,
    97260,
    153900,
    75255,
    82035,
    72165,
    55440,
    50145,
    51960,
    114540,
    45915,
    58200,
    21855,
    31680,
    30750,
    40830,
    27615,
    71730,
    72555,
    73845,
    62865,
    135885,
    56010,
    81060,
    89325,
    156450,
    84060,
    70455,
    156180,
    120420,
    259110,
    388395,
    198420,
    426915,
    548880,
    288675,
    148275,
    153000,
    249930,
    217470,
    137895,
    85650,
    81420,
    94800,
    498615,
    435285,
    657855,
    355785,
    209700,
    205890,
    275535,
    177900,
    99300,
    109665,
    114195,
    189570,
    307935,
    310005,
    180375,
    119400,
    150420,
    96750,
    154905,
    107295,
    89445,
    51360,
    56115,
    76755,
    86250,
    553605,
    267345,
    213405,
    150150,
    97005,
    71220,
    71145,
    131100,
    110925,
    153705,
    133365,
    94260,
    97620,
    66105,
    81690,
    72915,
    148365,
    99360,
    65880,
    112935,
    83580,
    231240,
    275805,
    142080,
    107760,
    102825,
    67905,
    71985,
    119160,
    157200,
    163455,
    114825,
    107385,
    74670,
    209070,
    148905,
    208920,
    114870,
    71595,
    94410,
    171210,
    137235,
    111540,
    114240,
    72270,
    97680,
    60450,
    61365,
    54525,
    131115,
    83550,
    92130,
    56475,
    234195,
    144990,
    91635,
    171105,
    115020,
    81555,
    70770,
    82305,
    88275,
    64005,
    91695,
    119445,
    320340,
    137010,
    261540,
    312390,
    129000,
    193440,
    225720,
    110955,
    146025,
    146040,
    157845,
    113715,
    128910,
    94335,
    142575,
    84240,
    98910,
    180345,
    121830,
    114135,
    118065,
    134985,
    71835,
    121470,
    296115,
    191640,
    179145,
    187695,
    92835,
    185940,
    298725,
    169965,
    236385,
    214800,
    143070,
    189735,
    182460,
    118650,
    126915,
    237255,
    381675,
    319455,
    184245,
    177105,
    187620,
    249360,
    140205,
    202920,
    192555,
    219930,
    210975,
    146670,
    198345,
    214245,
    272295
  ],
  "start_Time": [
    1396410300,
    1396410360,
    1396410420,
    1396410480,
    1396410540,
    1396410600,
    1396410660,
    1396410720,
    1396410780,
    1396410840,
    1396410900,
    1396410960,
    1396411020,
    1396411080,
    1396411140,
    1396411200,
    1396411260,
    1396411320,
    1396411380,
    1396411440,
    1396411500,
    1396411560,
    1396411620,
    1396411680,
    1396411740,
    1396411800,
    1396411860,
    1396411920,
    1396411980,
    1396412040,
    1396412100,
    1396412160,
    1396412220,
    1396412280,
    1396412340,
    1396412400,
    1396412460,
    1396412520,
    1396412580,
    1396412640,
    1396412700,
    1396412760,
    1396412820,
    1396412880,
    1396412940,
    1396413000,
    1396413060,
    1396413120,
    1396413180,
    1396413240,
    1396413300,
    1396413360,
    1396413420,
    1396413480,
    1396413540,
    1396413600,
    1396413660,
    1396413720,
    1396413780,
    1396413840,
    1396413900,
    1396413960,
    1396414020,
    1396414080,
    1396414140,
    1396414200,
    1396414260,
    1396414320,
    1396414380,
    1396414440,
    1396414500,
    1396414560,
    1396414620,
    1396414680,
    1396414740,
    1396414800,
    1396414860,
    1396414920,
    1396414980,
    1396415040,
    1396415100,
    1396415160,
    1396415220,
    1396415280,
    1396415340,
    1396415400,
    1396415460,
    1396415520,
    1396415580,
    1396415640,
    1396415700,
    1396415760,
    1396415820,
    1396415880,
    1396415940,
    1396416000,
    1396416060,
    1396416120,
    1396416180,
    1396416240,
    1396416300,
    1396416360,
    1396416420,
    1396416480,
    1396416540,
    1396416600,
    1396416660,
    1396416720,
    1396416780,
    1396416840,
    1396416900,
    1396416960,
    1396417020,
    1396417080,
    1396417140,
    1396417200,
    1396417260,
    1396417320,
    1396417380,
    1396417440,
    1396417500,
    1396417560,
    1396417620,
    1396417680,
    1396417740,
    1396417800,
    1396417860,
    1396417920,
    1396417980,
    1396418040,
    1396418100,
    1396418160,
    1396418220,
    1396418280,
    1396418340,
    1396418400,
    1396418460,
    1396418520,
    1396418580,
    1396418640,
    1396418700,
    1396418760,
    1396418820,
    1396418880,
    1396418940,
    1396419000,
    1396419060,
    1396419120,
    1396419180,
    1396419240,
    1396419300,
    1396419360,
    1396419420,
    1396419480,
    1396419540,
    1396419600,
    1396419660,
    1396419720,
    1396419780,
    1396419840,
    1396419900,
    1396419960,
    1396420020,
    1396420080,
    1396420140,
    1396420200,
    1396420260,
    1396420320,
    1396420380,
    1396420440,
    1396420500,
    1396420560,
    1396420620,
    1396420680,
    1396420740,
    1396420800,
    1396420860,
    1396420920,
    1396420980,
    1396421040,
    1396421100,
    1396421160,
    1396421220,
    1396421280,
    1396421340,
    1396421400,
    1396421460,
    1396421520,
    1396421580,
    1396421640,
    1396421700,
    1396421760,
    1396421820,
    1396421880,
    1396421940,
    1396422000,
    1396422060,
    1396422120,
    1396422180,
    1396422240,
    1396422300,
    1396422360,
    1396422420,
    1396422480,
    1396422540,
    1396422600,
    1396422660,
    1396422720,
    1396422780,
    1396422840,
    1396422900,
    1396422960,
    1396423020,
    1396423080,
    1396423140,
    1396423200,
    1396423260,
    1396423320,
    1396423380,
    1396423440,
    1396423500,
    1396423560,
    1396423620,
    1396423680,
    1396423740,
    1396423800,
    1396423860,
    1396423920,
    1396423980,
    1396424040,
    1396424100,
    1396424160,
    1396424220,
    1396424280,
    1396424340,
    1396424400,
    1396424460,
    1396424520,
    1396424580,
    1396424640,
    1396424700,
    1396424760,
    1396424820,
    1396424880,
    1396424940,
    1396425000,
    1396425060,
    1396425120,
    1396425180,
    1396425240,
    1396425300,
    1396425360,
    1396425420,
    1396425480,
    1396425540,
    1396425600,
    1396425660,
    1396425720,
    1396425780,
    1396425840,
    1396425900,
    1396425960,
    1396426020,
    1396426080,
    1396426140,
    1396426200,
    1396426260,
    1396426320,
    1396426380,
    1396426440,
    1396426500,
    1396426560,
    1396426620,
    1396426680,
    1396426740,
    1396426800,
    1396426860,
    1396426920,
    1396426980,
    1396427040,
    1396427100,
    1396427160,
    1396427220,
    1396427280,
    1396427340,
    1396427400,
    1396427460,
    1396427520,
    1396427580,
    1396427640,
    1396427700,
    1396427760,
    1396427820,
    1396427880,
    1396427940,
    1396428000,
    1396428060,
    1396428120,
    1396428180,
    1396428240,
    1396428300,
    1396428360,
    1396428420,
    1396428480,
    1396428540,
    1396428600,
    1396428660,
    1396428720,
    1396428780,
    1396428840,
    1396428900,
    1396428960,
    1396429020,
    1396429080,
    1396429140,
    1396429200,
    1396429260,
    1396429320,
    1396429380,
    1396429440,
    1396429500,
    1396429560,
    1396429620,
    1396429680,
    1396429740,
    1396429800,
    1396429860,
    1396429920,
    1396429980,
    1396430040,
    1396430100,
    1396430160,
    1396430220,
    1396430280,
    1396430340,
    1396430400,
    1396430460,
    1396430520,
    1396430580,
    1396430640,
    1396430700,
    1396430760,
    1396430820,
    1396430880,
    1396430940,
    1396431000,
    1396431060,
    1396431120,
    1396431180,
    1396431240,
    1396431300,
    1396431360,
    1396431420,
    1396431480,
    1396431540,
    1396431600,
    1396431660,
    1396431720,
    1396431780,
    1396431840,
    1396431900,
    1396431960,
    1396432020,
    1396432080,
    1396432140,
    1396432200,
    1396432260,
    1396432320,
    1396432380,
    1396432440,
    1396432500,
    1396432560,
    1396432620,
    1396432680,
    1396432740
  ]
}

const averagedData = calculateAverage(Response, 60);
console.log(averagedData);
// Transform averagedData to match the required format
const formattedData = [];
for (let i = 0; i < averagedData.start_Time.length; i++) {
    const dataPoint = {
        x: new Date(averagedData.start_Time[i] * 1000), // Convert Unix timestamp to JavaScript Date object
        y: [averagedData.open[i], averagedData.high[i], averagedData.low[i], averagedData.close[i]]
    };
    formattedData.push(dataPoint);
}
console.log(formattedData);
// Configure the chart
var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "dark",
    title: {
        text: "Candlestick Chart"
    },
    backgroundColor: "#15161a", 
    axisX: {
        valueFormatString: "mm",
        interval: 1,
        intervalType: "hour"
    },
    axisY: {
        title: "Price",
        includeZero: false
    },
    data: [{
        type: "candlestick",
        risingColor: "#00FF00",
        fallingColor: "#FF0000",
        dataPoints: formattedData
    }]
});

// Render the chart
chart.render();