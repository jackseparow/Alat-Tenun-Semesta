/**
 * Custom Blocks: ALAT TENUN SEMESTA (Basis Elemen Alam & Fraktal 3D)
 * BBGTK DIY
 */

// 1. Elemen Basis: Kelopak Bunga / Daun Organik
Blockly.Blocks['nature_petal'] = {
  init: function() {
    this.appendDummyInput().appendField("kelopak / daun");
    this.appendValueInput("LENGTH").setCheck("Number").appendField("panjang");
    this.appendValueInput("WIDTH").setCheck("Number").appendField("lebar");
    this.appendValueInput("CURVE").setCheck("Number").appendField("kelengkungan");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#E91E63");
    this.setTooltip("Membuat mahkota kelopak bunga atau daun melengkung 3D");
  }
};

javascript.javascriptGenerator.forBlock['nature_petal'] = function(block, generator) {
  var len = generator.valueToCode(block, 'LENGTH', generator.ORDER_ATOMIC) || '15';
  var wid = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '6';
  var curve = generator.valueToCode(block, 'CURVE', generator.ORDER_ATOMIC) || '4';

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

// 2. Elemen Basis: Biji / Node Spiral
Blockly.Blocks['nature_seed'] = {
  init: function() {
    this.appendDummyInput().appendField("biji / node");
    this.appendValueInput("RADIUS").setCheck("Number").appendField("ukuran");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FF9800");
    this.setTooltip("Membuat bulatan biji atau titik node spiral");
  }
};

javascript.javascriptGenerator.forBlock['nature_seed'] = function(block, generator) {
  var rad = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '1.5';

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

// 3. Elemen Basis: Batang / Ranting
Blockly.Blocks['nature_stem'] = {
  init: function() {
    this.appendDummyInput().appendField("batang / ranting");
    this.appendValueInput("RADIUS_BOTTOM").setCheck("Number").appendField("r-bawah");
    this.appendValueInput("RADIUS_TOP").setCheck("Number").appendField("r-atas");
    this.appendValueInput("HEIGHT").setCheck("Number").appendField("tinggi");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#795548");
    this.setTooltip("Membuat segmen silinder ranting/batang pohon");
  }
};

javascript.javascriptGenerator.forBlock['nature_stem'] = function(block, generator) {
  var rb = generator.valueToCode(block, 'RADIUS_BOTTOM', generator.ORDER_ATOMIC) || '2';
  var rt = generator.valueToCode(block, 'RADIUS_TOP', generator.ORDER_ATOMIC) || '1.5';
  var h = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';

  return `
(function() {
  const rBottom = Number(${rb});
  const rTop = Number(${rt});
  const heightVal = Number(${h});

  const geo = new THREE.CylinderGeometry(rTop, rBottom, heightVal, 12);
  geo.translate(0, heightVal / 2, 0); // Pindahkan origin ke pangkal bawah batang

  const mat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.7 });
  const mesh = new THREE.Mesh(geo, mat);
  sceneGroup.add(mesh);
})();
`;
};

// 4. Elemen Basis: Modul Origami / Flap Mekar (Miura-ori Face)
Blockly.Blocks['nature_origami_face'] = {
  init: function() {
    this.appendDummyInput().appendField("modul origami (belah ketupat)");
    this.appendValueInput("SIZE").setCheck("Number").appendField("panjang");
    this.appendValueInput("ANGLE").setCheck("Number").appendField("sudut buka (°)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#9C27B0");
    this.setTooltip("Membuat permukaan lipatan belah ketupat origami untuk struktur mekar");
  }
};

javascript.javascriptGenerator.forBlock['nature_origami_face'] = function(block, generator) {
  var size = generator.valueToCode(block, 'SIZE', generator.ORDER_ATOMIC) || '10';
  var angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '60';

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

// 5. Elemen Basis: Segmen Cangkang / Sulur Lengkung
Blockly.Blocks['nature_shell_segment'] = {
  init: function() {
    this.appendDummyInput().appendField("segmen cangkang / sulur");
    this.appendValueInput("RADIUS").setCheck("Number").appendField("radius");
    this.appendValueInput("TUBE").setCheck("Number").appendField("tebal pipa");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#009688");
    this.setTooltip("Membuat lengkungan melingkar/torus bertahap untuk cangkang nautilus");
  }
};

javascript.javascriptGenerator.forBlock['nature_shell_segment'] = function(block, generator) {
  var r = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '8';
  var t = generator.valueToCode(block, 'TUBE', generator.ORDER_ATOMIC) || '2';

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

// 6. Blok Kunci: Sudut Keemasan (Golden Angle 137.5°)
Blockly.Blocks['nature_golden_angle'] = {
  init: function() {
    this.appendDummyInput().appendField("Sudut Keemasan (137.5°)");
    this.setOutput(true, "Number");
    this.setColour("#5B80A5");
    this.setTooltip("Konstanta rasio penataan alami (Golden Angle = 137.5 derajat)");
  }
};

javascript.javascriptGenerator.forBlock['nature_golden_angle'] = function(block) {
  return ['137.5', javascript.javascriptGenerator.ORDER_ATOMIC];
};
