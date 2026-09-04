const PROJECT_STORAGE_KEY = "renovatecalc_project";

/* =========================================================
   DEFAULT PROJECT
   ========================================================= */

export const createDefaultProject = () => ({
  project: {
    name: "",
    client: "",
    location: "",
    estimateNo: `EST-${Date.now()
      .toString()
      .slice(-6)}`,
  },

  /* Field measurements */
  measurements: {},

  /* Calculated material data */
  materials: {},

  /* Working shopping list */
  shoppingList: [],

  /* Final / committed BOQ items */
  boqItems: [],

  /* Labour */
  labour: {
    items: [],
    total: 0,
  },

  /* Estimate */
  estimate: {
    transport: 0,
    otherCharges: 0,
    notes: "",
  },

  /* Project metadata */
  meta: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "DRAFT",
  },
});

/* =========================================================
   LOAD PROJECT
   ========================================================= */

export const getProject = () => {
  try {
    const saved = localStorage.getItem(
      PROJECT_STORAGE_KEY
    );

    if (!saved) {
      return createDefaultProject();
    }

    const parsed = JSON.parse(saved);

    const defaultProject = createDefaultProject();

    return {
      ...defaultProject,
      ...parsed,

      /* -----------------------------------------------------
         PROJECT INFORMATION
      ----------------------------------------------------- */

      project: {
        ...defaultProject.project,
        ...(parsed.project || {}),
      },

      /* -----------------------------------------------------
         MEASUREMENTS
      ----------------------------------------------------- */

      measurements:
        parsed.measurements || {},

      /* -----------------------------------------------------
         MATERIALS
      ----------------------------------------------------- */

      materials:
        parsed.materials || {},

      /* -----------------------------------------------------
         SHOPPING LIST
      ----------------------------------------------------- */

      shoppingList:
        Array.isArray(parsed.shoppingList)
          ? parsed.shoppingList
          : [],

      /* -----------------------------------------------------
         BOQ ITEMS
      ----------------------------------------------------- */

      boqItems:
        Array.isArray(parsed.boqItems)
          ? parsed.boqItems
          : [],

      /* -----------------------------------------------------
         LABOUR
      ----------------------------------------------------- */

      labour: {
        ...defaultProject.labour,
        ...(parsed.labour || {}),

        items:
          Array.isArray(parsed.labour?.items)
            ? parsed.labour.items
            : [],

        total:
          Number(parsed.labour?.total) || 0,
      },

      /* -----------------------------------------------------
         ESTIMATE
      ----------------------------------------------------- */

      estimate: {
        ...defaultProject.estimate,
        ...(parsed.estimate || {}),

        transport:
          Number(parsed.estimate?.transport) || 0,

        otherCharges:
          Number(parsed.estimate?.otherCharges) || 0,

        notes:
          parsed.estimate?.notes || "",
      },

      /* -----------------------------------------------------
         META
      ----------------------------------------------------- */

      meta: {
        ...defaultProject.meta,
        ...(parsed.meta || {}),
      },
    };
  } catch (error) {
    console.error(
      "Failed to load RenovateCalc project:",
      error
    );

    return createDefaultProject();
  }
};

/* =========================================================
   SAVE COMPLETE PROJECT
   ========================================================= */

export const saveProject = (project) => {
  const updatedProject = {
    ...project,

    meta: {
      ...(project.meta || {}),
      updatedAt: new Date().toISOString(),
    },
  };

  localStorage.setItem(
    PROJECT_STORAGE_KEY,
    JSON.stringify(updatedProject)
  );

  return updatedProject;
};

/* =========================================================
   UPDATE PROJECT
   ========================================================= */

export const updateProject = (updates) => {
  const currentProject = getProject();

  const updatedProject = {
    ...currentProject,
    ...updates,
  };

  return saveProject(updatedProject);
};

/* =========================================================
   SAVE PROJECT INFORMATION
   ========================================================= */

export const saveProjectInfo = (projectInfo) => {
  const project = getProject();

  return saveProject({
    ...project,

    project: {
      ...project.project,
      ...(projectInfo || {}),
    },
  });
};

/* =========================================================
   SAVE MEASUREMENTS
   ========================================================= */

export const saveProjectMeasurements = (
  measurements
) => {
  const project = getProject();

  return saveProject({
    ...project,

    measurements:
      measurements || {},
  });
};

/* =========================================================
   SAVE MATERIAL TO PROJECT
   ========================================================= */

export const saveMaterialToProject = (
  materialKey,
  materialData
) => {
  const project = getProject();

  return saveProject({
    ...project,

    materials: {
      ...(project.materials || {}),

      [materialKey]: {
        ...materialData,

        savedAt:
          new Date().toISOString(),
      },
    },
  });
};

/* =========================================================
   REMOVE MATERIAL FROM PROJECT
   ========================================================= */

export const removeMaterialFromProject = (
  materialKey
) => {
  const project = getProject();

  const materials = {
    ...(project.materials || {}),
  };

  delete materials[materialKey];

  return saveProject({
    ...project,
    materials,
  });
};

/* =========================================================
   SAVE SHOPPING LIST
   ========================================================= */

export const saveProjectShoppingList = (
  shoppingList
) => {
  const project = getProject();

  return saveProject({
    ...project,

    shoppingList:
      Array.isArray(shoppingList)
        ? shoppingList
        : [],
  });
};

/* =========================================================
   ADD / UPDATE BOQ ITEM
   ========================================================= */

export const saveBOQItem = (item) => {
  const project = getProject();

  const existingItems =
    Array.isArray(project.boqItems)
      ? project.boqItems
      : [];

  const newItem = {
    ...item,

    id:
      item?.id ||
      `BOQ-${Date.now()}`,

    savedAt:
      item?.savedAt ||
      new Date().toISOString(),
  };

  const itemExists = existingItems.some(
    (existing) =>
      existing.id === newItem.id
  );

  const updatedItems = itemExists
    ? existingItems.map((existing) =>
        existing.id === newItem.id
          ? newItem
          : existing
      )
    : [
        ...existingItems,
        newItem,
      ];

  return saveProject({
    ...project,

    boqItems: updatedItems,
  });
};

/* =========================================================
   SAVE MULTIPLE BOQ ITEMS
   ========================================================= */

export const saveBOQItems = (items) => {
  const project = getProject();

  const normalizedItems =
    Array.isArray(items)
      ? items.map((item, index) => ({
          ...item,

          id:
            item?.id ||
            `BOQ-${Date.now()}-${index}`,

          savedAt:
            item?.savedAt ||
            new Date().toISOString(),
        }))
      : [];

  return saveProject({
    ...project,

    boqItems:
      normalizedItems,
  });
};

/* =========================================================
   SAVE SHOPPING LIST ITEMS TO BOQ
   ========================================================= */

export const saveShoppingListToBOQ = () => {
  const project = getProject();

  const shoppingList =
    Array.isArray(project.shoppingList)
      ? project.shoppingList
      : [];

  const existingBOQ =
    Array.isArray(project.boqItems)
      ? project.boqItems
      : [];

  /*
     Keep existing BOQ items and add shopping-list
     items that are not already present.
  */

  const newBOQItems =
    shoppingList.map(
      (item, index) => ({
        ...item,

        id:
          item?.id ||
          `BOQ-${Date.now()}-${index}`,

        savedAt:
          new Date().toISOString(),
      })
    );

  const mergedBOQ = [
    ...existingBOQ,
    ...newBOQItems.filter(
      (newItem) =>
        !existingBOQ.some(
          (existingItem) =>
            existingItem.id ===
            newItem.id
        )
    ),
  ];

  return saveProject({
    ...project,

    boqItems: mergedBOQ,
  });
};

/* =========================================================
   REMOVE BOQ ITEM
   ========================================================= */

export const removeBOQItem = (
  itemId
) => {
  const project = getProject();

  const boqItems =
    Array.isArray(project.boqItems)
      ? project.boqItems
      : [];

  return saveProject({
    ...project,

    boqItems:
      boqItems.filter(
        (item) =>
          item.id !== itemId
      ),
  });
};

/* =========================================================
   CLEAR ALL BOQ ITEMS
   ========================================================= */

export const clearBOQItems = () => {
  const project = getProject();

  return saveProject({
    ...project,

    boqItems: [],
  });
};

/* =========================================================
   GET BOQ ITEMS
   ========================================================= */

export const getBOQItems = () => {
  const project = getProject();

  return Array.isArray(
    project.boqItems
  )
    ? project.boqItems
    : [];
};

/* =========================================================
   SAVE LABOUR
   ========================================================= */

export const saveProjectLabour = (
  labourItems,
  total
) => {
  const project = getProject();

  return saveProject({
    ...project,

    labour: {
      items:
        Array.isArray(labourItems)
          ? labourItems
          : [],

      total:
        Number(total) || 0,
    },
  });
};

/* =========================================================
   SAVE LABOUR ITEM
   ========================================================= */

export const saveLabourItem = (
  labourItem
) => {
  const project = getProject();

  const existingItems =
    Array.isArray(
      project.labour?.items
    )
      ? project.labour.items
      : [];

  const newItem = {
    ...labourItem,

    id:
      labourItem?.id ||
      `LABOUR-${Date.now()}`,

    savedAt:
      labourItem?.savedAt ||
      new Date().toISOString(),
  };

  const itemExists =
    existingItems.some(
      (item) =>
        item.id === newItem.id
    );

  const updatedItems =
    itemExists
      ? existingItems.map(
          (item) =>
            item.id === newItem.id
              ? newItem
              : item
        )
      : [
          ...existingItems,
          newItem,
        ];

  const total =
    updatedItems.reduce(
      (sum, item) =>
        sum +
        (Number(item.amount) ||
          Number(item.total) ||
          0),
      0
    );

  return saveProject({
    ...project,

    labour: {
      items: updatedItems,
      total,
    },
  });
};

/* =========================================================
   REMOVE LABOUR ITEM
   ========================================================= */

export const removeLabourItem = (
  itemId
) => {
  const project = getProject();

  const existingItems =
    Array.isArray(
      project.labour?.items
    )
      ? project.labour.items
      : [];

  const updatedItems =
    existingItems.filter(
      (item) =>
        item.id !== itemId
    );

  const total =
    updatedItems.reduce(
      (sum, item) =>
        sum +
        (Number(item.amount) ||
          Number(item.total) ||
          0),
      0
    );

  return saveProject({
    ...project,

    labour: {
      items: updatedItems,
      total,
    },
  });
};

/* =========================================================
   SAVE ESTIMATE DETAILS
   ========================================================= */

export const saveProjectEstimate = (
  estimate
) => {
  const project = getProject();

  return saveProject({
    ...project,

    estimate: {
      ...project.estimate,
      ...(estimate || {}),

      transport:
        Number(
          estimate?.transport ??
            project.estimate
              ?.transport
        ) || 0,

      otherCharges:
        Number(
          estimate?.otherCharges ??
            project.estimate
              ?.otherCharges
        ) || 0,
    },
  });
};

/* =========================================================
   CALCULATE PROJECT TOTAL
   ========================================================= */

export const calculateProjectTotal = () => {
  const project = getProject();

  const boqItems =
    Array.isArray(
      project.boqItems
    )
      ? project.boqItems
      : [];

  const materialTotal =
    boqItems.reduce(
      (total, item) => {
        const quantity =
          Number(
            item.quantity
          ) || 0;

        const rate =
          Number(
            item.price
          ) || 0;

        return (
          total +
          quantity * rate
        );
      },
      0
    );

  const labourTotal =
    Number(
      project.labour?.total
    ) || 0;

  const transport =
    Number(
      project.estimate?.transport
    ) || 0;

  const otherCharges =
    Number(
      project.estimate
        ?.otherCharges
    ) || 0;

  return (
    materialTotal +
    labourTotal +
    transport +
    otherCharges
  );
};

/* =========================================================
   SAVE FINAL ESTIMATE
   ========================================================= */

export const saveFinalEstimate = (
  estimateData = {}
) => {
  const project = getProject();

  const grandTotal =
    calculateProjectTotal();

  return saveProject({
    ...project,

    estimate: {
      ...project.estimate,
      ...(estimateData || {}),

      transport:
        Number(
          estimateData.transport ??
            project.estimate
              ?.transport
        ) || 0,

      otherCharges:
        Number(
          estimateData.otherCharges ??
            project.estimate
              ?.otherCharges
        ) || 0,

      grandTotal,

      savedAt:
        new Date().toISOString(),
    },

    meta: {
      ...(project.meta || {}),
      status: "SAVED",
    },
  });
};

/* =========================================================
   SET PROJECT STATUS
   ========================================================= */

export const setProjectStatus = (
  status
) => {
  const project = getProject();

  return saveProject({
    ...project,

    meta: {
      ...(project.meta || {}),
      status,
    },
  });
};

/* =========================================================
   CLEAR PROJECT
   ========================================================= */

export const clearProject = () => {
  localStorage.removeItem(
    PROJECT_STORAGE_KEY
  );

  return createDefaultProject();
};

/* =========================================================
   EXPORT STORAGE KEY
   ========================================================= */

export {
  PROJECT_STORAGE_KEY,
};