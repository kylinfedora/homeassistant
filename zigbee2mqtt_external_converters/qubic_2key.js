const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;
const fzLocal = {
    qubic_click: {
        cluster: 'genMultistateInput',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
            const clickMapping = {0: 'release', 1: 'single', 2: 'double', 3: 'tripple', 4: 'hold'};
			const buttonMapping = {2:'up',3:'down'};
			const button = buttonMapping[msg.endpoint.ID];
            return {action: `${button}_${clickMapping[msg.data['presentValue']]}`};
			
        },
    },	
};

const definition  = {
    zigbeeModel: ['qubic_2key'],
    model: 'SO11',
	vendor: 'qubic',
	description: '[配置链接](https://gitee.com/linoul/zigbee2mqtt_external_converters)',
    fromZigbee: [fz.ignore_basic_report, fz.battery,fzLocal.qubic_click],
    toZigbee: [],
    exposes: [e.battery(), e.action(['single', 'double', 'triple', 'hold', 'release']), e.battery_voltage(),],

    icon: 'data:image/png;base64,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',
};

module.exports = definition;
