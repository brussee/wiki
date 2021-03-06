/**
 * create an iterable array of selected cells from the selection object
 *
 * @param selection object
 * @returns {Array}
 */
var edittable_cellArray = function (selection) {
    var selectionArray = [];
    for (var currentRow = selection.start.row; currentRow <= selection.end.row; ++currentRow) {
        for (var currentCol = selection.start.col; currentCol <= selection.end.col; ++currentCol) {
            selectionArray.push({row:currentRow, col: currentCol});
        }
    }
    return selectionArray;
};

/**
 * Defines our own contextMenu with custom callbacks
 *
 * @param data array
 * @param meta array
 * @returns object
 */
function getEditTableContextMenu(data, meta) {
    return {
        items: {
            toggle_header: {
                name: LANG.plugins.edittable.toggle_header,
                callback: function (key, selection) {
                    jQuery.each(edittable_cellArray(selection), function (index, cell) {
                        var col = cell.col;
                        var row = cell.row;

                        if (meta[row][col].tag && meta[row][col].tag === 'th') {
                            meta[row][col].tag = 'td';
                        } else {
                            meta[row][col].tag = 'th';
                        }
                    });
                    this.render();
                }
            },
            align_left: {
                name: LANG.plugins.edittable.align_left,
                callback: function (key, selection) {
                    jQuery.each(edittable_cellArray(selection), function (index, cell) {
                        var col = cell.col;
                        var row = cell.row;
                        meta[row][col].align = 'left';
                    });
                    this.render();
                },
                disabled: function () {
                    var selection = this.getSelected();
                    var row = selection[0];
                    var col = selection[1];
                    return (!meta[row][col].align || meta[row][col].align === 'left');
                }
            },
            align_center: {
                name: LANG.plugins.edittable.align_center,
                callback: function (key, selection) {
                    jQuery.each(edittable_cellArray(selection), function (index, cell) {
                        var col = cell.col;
                        var row = cell.row;
                        meta[row][col].align = 'center';
                    });
                    this.render();
                },
                disabled: function () {
                    var selection = this.getSelected();
                    var row = selection[0];
                    var col = selection[1];
                    return (meta[row][col].align && meta[row][col].align === 'center');
                }
            },
            align_right: {
                name: LANG.plugins.edittable.align_right,
                callback: function (key, selection) {
                    jQuery.each(edittable_cellArray(selection), function (index, cell) {
                        var col = cell.col;
                        var row = cell.row;
                        meta[row][col].align = 'right';
                    });
                    this.render();
                },
                disabled: function () {
                    var selection = this.getSelected();
                    var row = selection[0];
                    var col = selection[1];
                    return (meta[row][col].align && meta[row][col].align === 'right');
                }
            },
            hsep1: '---------',
            row_above: {
                name: LANG.plugins.edittable.row_above
            },
            remove_row: {
                name: LANG.plugins.edittable.remove_row,
                /**
                 * The same as the default action, but with confirmation
                 *
                 * @param key
                 * @param selection
                 */
                callback: function (key, selection) {
                    if (window.confirm(LANG.plugins.edittable.confirmdeleterow)) {
                        var amount = selection.end.row - selection.start.row + 1;
                        this.alter("remove_row", selection.start.row, amount);
                    }
                },
                /**
                 * do not show when this is the last row
                 */
                disabled: function () {
                    return (this.countRows() <= 1);
                }
            },
            row_below: {
                name: LANG.plugins.edittable.row_below
            },
            hsep2: '---------',
            col_left: {
                name: LANG.plugins.edittable.col_left
            },
            remove_col: {
                name: LANG.plugins.edittable.remove_col,
                /**
                 * The same as the default action, but with confirmation
                 *
                 * @param key
                 * @param selection
                 */
                callback: function (key, selection) {
                    if (window.confirm(LANG.plugins.edittable.confirmdeletecol)) {
                        var amount = selection.end.col - selection.start.col + 1;
                        this.alter("remove_col", selection.start.col, amount);
                    }
                },
                /**
                 * do not show when this is the last row
                 */
                disabled: function () {
                    return (this.countCols() <= 1);
                }
            },
            col_right: {
                name: LANG.plugins.edittable.col_right
            },
            hsep3: '---------',
            mergeCells: {
                name: function() {
                    var sel = this.getSelected();
                    var info = this.mergeCells.mergedCellInfoCollection.getInfo(sel[0], sel[1]);
                    if (info) {
                        return '<div class="unmerge">' + LANG.plugins.edittable.unmerge_cells + '</div>';
                    } else {
                        return '<div class="merge">' + LANG.plugins.edittable.merge_cells + '</div>';
                    }
                },

                /**
                 * disable if only one cell is selected
                 *
                 * @returns {boolean}
                 */
                disabled: function () {
                    var selection = this.getSelected();
                    var startRow = selection[0];
                    var startCol = selection[1];
                    var endRow = selection[2];
                    var endCol = selection[3];
                    return startRow === endRow && startCol === endCol;
                }

            }
        }
    };
}
