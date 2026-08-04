/**
 * ALAT TENUN SEMESTA - BUNDLE MODUL UTUH
 * Elemen Alam + Transformasi Dasar
 * BBGTK DIY
 */

const jsGenNature = (typeof javascript !== 'undefined' && javascript.javascriptGenerator) ? javascript.javascriptGenerator : javascriptGenerator;

// ==========================================
// 1. ELEMEN BASIS ALAM
// ==========================================

// Kelopak Bunga / Daun
Blockly.Blocks['nature_petal'] = {
  init: function() {
    this.appendDummyInput().appendField("kelopak / daun");
    this.appendValueInput("LENGTH").setCheck("Number").appendField("panjang");
    this.appendValueInput("WIDTH").setCheck("Number").appendField("lebar");
    this.appendValueInput("CURVE").setCheck("Number").appendField("kelengkungan");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#E91E63");
    this.setTooltip("Membuat mahkota kelopak bunga atau daun 3D melengkung");
  }
};

jsGenNature.forBlock['nature_petal'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var len = gen.valueToCode(block, 'LENGTH', gen.ORDER_ATOMIC) || '15';
  var wid = gen.valueToCode(block, 'WIDTH', gen.ORDER_ATOMIC) || '6';
  var curve = gen.valueToCode(block, 'CURVE', gen.ORDER_ATOMIC) || '4';

  return `
(function() {
  const l = Number(${len});
  const w = Number(${wid});
  const c = Number(${curve});

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(w / 2, l / 2, 0, l);
  shape.quadraticCurveTo(-w / 2, l / 2, 0, 0);

  const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let y = pos.getY(i);
    let z = pos.getZ(i);
    pos.setZ(i, z + Math.sin((y / l) * Math.PI) * c);
  }
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({ color: 0xe91e63, roughness: 0.3, metalness: 0.1, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  sceneGroup.add(mesh);
})();
`;
};

// Biji / Node Spiral
Blockly.Blocks['nature_seed'] = {
  init: function() {
    this.appendDummyInput().appendField("biji / node");
    this.appendValueInput("RADIUS").setCheck("Number").appendField("ukuran");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FF9800");
    this.setTooltip("Membuat bulatan biji padat atau titik node kisi spiral");
  }
};

jsGenNature.forBlock['nature_seed'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var rad = gen.valueToCode(block, 'RADIUS', gen.ORDER_ATOMIC) || '1.5';

  return `
(function() {
  const r = Number(${rad});
  const geo = new THREE.SphereGeometry(r, 16, 16);
  const mat = new THREE.MeshStandardMaterial({ color: 0xffb300, roughness: 0.4, metalness: 0.2 });
  const mesh = new THREE.Mesh(geo, mat);
  sceneGroup.add(mesh);
})();
`;
};

// Batang / Ranting
Blockly.Blocks['nature_stem'] = {
  init: function() {
    this.appendDummyInput().appendField("batang / ranting");
    this.appendValueInput("RADIUS_BOTTOM").setCheck("Number").appendField("r-bawah");
    this.appendValueInput("RADIUS_TOP").setCheck("Number").appendField("r-atas");
    this.appendValueInput("HEIGHT").setCheck("Number").appendField("tinggi");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#795548");
    this.setTooltip("Membuat segmen silinder ranting/batang dengan engsel di pangkal");
  }
};

jsGenNature.forBlock['nature_stem'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var rb = gen.valueToCode(block, 'RADIUS_BOTTOM', gen.ORDER_ATOMIC) || '2';
  var rt = gen.valueToCode(block, 'RADIUS_TOP', gen.ORDER_ATOMIC) || '1.5';
  var h = gen.valueToCode(block, 'HEIGHT', gen.ORDER_ATOMIC) || '10';

  return `
(function() {
  const rBottom = Number(${rb});
  const rTop = Number(${rt});
  const heightVal = Number(${h});

  const geo = new THREE.CylinderGeometry(rTop, rBottom, heightVal, 12);
  geo.translate(0, heightVal / 2, 0);

  const mat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.7 });
  const mesh = new THREE.Mesh(geo, mat);
  sceneGroup.add(mesh);
})();
`;
};

// Modul Belah Ketupat Origami
Blockly.Blocks['nature_origami_face'] = {
  init: function() {
    this.appendDummyInput().appendField("modul origami (belah ketupat)");
    this.appendValueInput("SIZE").setCheck("Number").appendField("panjang");
    this.appendValueInput("ANGLE").setCheck("Number").appendField("sudut buka (°)");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9C27B0");
    this.setTooltip("Membuat permukaan lipatan belah ketupat origami untuk struktur mekar");
  }
};

jsGenNature.forBlock['nature_origami_face'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var size = gen.valueToCode(block, 'SIZE', gen.ORDER_ATOMIC) || '10';
  var angle = gen.valueToCode(block, 'ANGLE', gen.ORDER_ATOMIC) || '60';

  return `
(function() {
  const s = Number(${size});
  const rad = (Number(${angle}) * Math.PI) / 180;

  const shape = new THREE.Shape();
  const w = s * Math.sin(rad / 2);
  const h = s * Math.cos(rad / 2);

  shape.moveTo(0, h);
  shape.lineTo(w, 0);
  shape.lineTo(0, -h);
  shape.lineTo(-w, 0);
  shape.closePath();

  const geo = new THREE.ShapeGeometry(shape);
  const mat = new THREE.MeshStandardMaterial({ color: 0xab47bc, side: THREE.DoubleSide, roughness: 0.3 });
  const mesh = new THREE.Mesh(geo, mat);
  sceneGroup.add(mesh);
})();
`;
};

// Segmen Cangkang Nautilus
Blockly.Blocks['nature_shell_segment'] = {
  init: function() {
    this.appendDummyInput().appendField("segmen cangkang / sulur");
    this.appendValueInput("RADIUS").setCheck("Number").appendField("radius");
    this.appendValueInput("TUBE").setCheck("Number").appendField("tebal pipa");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#009688");
    this.setTooltip("Membuat segmen lengkung torus untuk struktur cangkang nautilus");
  }
};

jsGenNature.forBlock['nature_shell_segment'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var r = gen.valueToCode(block, 'RADIUS', gen.ORDER_ATOMIC) || '8';
  var t = gen.valueToCode(block, 'TUBE', gen.ORDER_ATOMIC) || '2';

  return `
(function() {
  const radius = Number(${r});
  const tube = Number(${t});

  const geo = new THREE.TorusGeometry(radius, tube, 12, 24, Math.PI / 3);
  const mat = new THREE.MeshStandardMaterial({ color: 0x26a69a, roughness: 0.3 });
  const mesh = new THREE.Mesh(geo, mat);
  sceneGroup.add(mesh);
})();
`;
};

// Titik Poros / Pivot Node
Blockly.Blocks['nature_pivot'] = {
  init: function() {
    this.appendDummyInput().appendField("titik poros (pivot)");
    this.appendValueInput("SIZE").setCheck("Number").appendField("ukuran penanda");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#3F51B5");
    this.setTooltip("Menandai titik poros koordinat lokal untuk acuan transformasi bercabang");
  }
};

jsGenNature.forBlock['nature_pivot'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var sz = gen.valueToCode(block, 'SIZE', gen.ORDER_ATOMIC) || '1';

  return `
(function() {
  const sizeVal = Number(${sz});
  const axes = new THREE.AxesHelper(sizeVal * 3);
  sceneGroup.add(axes);
})();
`;
};

// Sudut Keemasan (Golden Angle 137.5°)
Blockly.Blocks['nature_golden_angle'] = {
  init: function() {
    this.appendDummyInput().appendField("Sudut Keemasan (137.5°)");
    this.setOutput(true, "Number");
    this.setColour("#5B80A5");
    this.setTooltip("Konstanta rasio penataan alami (Golden Angle = 137.5 derajat)");
  }
};

jsGenNature.forBlock['nature_golden_angle'] = function(block, generator) {
  var gen = generator || jsGenNature;
  return ['137.5', gen.ORDER_ATOMIC];
};


// ==========================================
// 2. TRANSFORMASI DASAR (DIPADUKAN KEMBALI)
// ==========================================

// Rotasi
Blockly.Blocks['transform_rotate'] = {
  init: function() {
    this.appendDummyInput().appendField("putar / rotasi (°)");
    this.appendValueInput("X").setCheck("Number").appendField("X");
    this.appendValueInput("Y").setCheck("Number").appendField("Y");
    this.appendValueInput("Z").setCheck("Number").appendField("Z");
    this.appendStatementInput("STACK").appendField("objek");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FF9800");
  }
};

jsGenNature.forBlock['transform_rotate'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var rx = gen.valueToCode(block, 'X', gen.ORDER_ATOMIC) || '0';
  var ry = gen.valueToCode(block, 'Y', gen.ORDER_ATOMIC) || '0';
  var rz = gen.valueToCode(block, 'Z', gen.ORDER_ATOMIC) || '0';
  var inner = gen.statementToCode(block, 'STACK');

  return `
(function() {
  const rotGroup = new THREE.Group();
  const parent = sceneGroup;
  sceneGroup = rotGroup;
  ${inner}
  sceneGroup = parent;
  rotGroup.rotation.x = (Number(${rx}) * Math.PI) / 180;
  rotGroup.rotation.y = (Number(${ry}) * Math.PI) / 180;
  rotGroup.rotation.z = (Number(${rz}) * Math.PI) / 180;
  sceneGroup.add(rotGroup);
})();
`;
};

// Pindah / Translate
Blockly.Blocks['transform_translate'] = {
  init: function() {
    this.appendDummyInput().appendField("pindah / geser");
    this.appendValueInput("X").setCheck("Number").appendField("X");
    this.appendValueInput("Y").setCheck("Number").appendField("Y");
    this.appendValueInput("Z").setCheck("Number").appendField("Z");
    this.appendStatementInput("STACK").appendField("objek");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FF9800");
  }
};

jsGenNature.forBlock['transform_translate'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var tx = gen.valueToCode(block, 'X', gen.ORDER_ATOMIC) || '0';
  var ty = gen.valueToCode(block, 'Y', gen.ORDER_ATOMIC) || '0';
  var tz = gen.valueToCode(block, 'Z', gen.ORDER_ATOMIC) || '0';
  var inner = gen.statementToCode(block, 'STACK');

  return `
(function() {
  const posGroup = new THREE.Group();
  const parent = sceneGroup;
  sceneGroup = posGroup;
  ${inner}
  sceneGroup = parent;
  posGroup.position.set(Number(${tx}), Number(${ty}), Number(${tz}));
  sceneGroup.add(posGroup);
})();
`;
};

// Skala / Scale
Blockly.Blocks['transform_scale'] = {
  init: function() {
    this.appendDummyInput().appendField("skala / perbesar");
    this.appendValueInput("X").setCheck("Number").appendField("X");
    this.appendValueInput("Y").setCheck("Number").appendField("Y");
    this.appendValueInput("Z").setCheck("Number").appendField("Z");
    this.appendStatementInput("STACK").appendField("objek");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FF9800");
  }
};

jsGenNature.forBlock['transform_scale'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var sx = gen.valueToCode(block, 'X', gen.ORDER_ATOMIC) || '1';
  var sy = gen.valueToCode(block, 'Y', gen.ORDER_ATOMIC) || '1';
  var sz = gen.valueToCode(block, 'Z', gen.ORDER_ATOMIC) || '1';
  var inner = gen.statementToCode(block, 'STACK');

  return `
(function() {
  const scaleGroup = new THREE.Group();
  const parent = sceneGroup;
  sceneGroup = scaleGroup;
  ${inner}
  sceneGroup = parent;
  scaleGroup.scale.set(Number(${sx}), Number(${sy}), Number(${sz}));
  sceneGroup.add(scaleGroup);
})();
`;
};

// Warna / Color Palette
Blockly.Blocks['transform_color_palette'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ubah warna")
        .appendField(new Blockly.FieldColour("#e91e63"), "COLOR");
    this.appendStatementInput("STACK").appendField("objek");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FF9800");
  }
};

jsGenNature.forBlock['transform_color_palette'] = function(block, generator) {
  var gen = generator || jsGenNature;
  var hex = block.getFieldValue('COLOR') || "#e91e63";
  var inner = gen.statementToCode(block, 'STACK');

  return `
(function() {
  const colorGroup = new THREE.Group();
  const parent = sceneGroup;
  sceneGroup = colorGroup;
  ${inner}
  sceneGroup = parent;
  colorGroup.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material = child.material.clone();
      child.material.color.setStyle("${hex}");
    }
  });
  sceneGroup.add(colorGroup);
})();
`;
};
