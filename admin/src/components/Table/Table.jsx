import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// core components
import tableStyle from "assets/jss/material-dashboard-react/components/tableStyle.jsx";

class CustomTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tableData: props.tableData,
			sortedRow: 0
		}

		this.sortBy = this.sortBy.bind(this);
	}

	sortBy = rowIndex => () => {
		let tableData = [...this.state.tableData];

		tableData.sort((a, b) =>
			('' + a[rowIndex]).localeCompare(b[rowIndex]) ? -1 : 1
		);

		this.setState({
			sortedRow: rowIndex,
			tableData
		});

	}


	componentWillReceiveProps(nextProps) {

		this.setState({ tableData: nextProps.tableData });
	}

	render() {
		const { classes, tableHead, tableHeaderColor, confidential = [] } = this.props;

		return (
			<div className={classes.tableResponsive}>
				<Table className={classes.table}>
					{tableHead !== undefined ? (
						<TableHead className={classes[tableHeaderColor + "TableHeader"]} >
							<TableRow>
								{tableHead.map((prop, key) => {
									return (
										<TableCell
											className={classes.tableCell + " " + classes.tableHeadCell}
											key={key}
											onClick={this.sortBy(key)}
										>
											{prop}
										</TableCell>
									);
								})}
							</TableRow>
						</TableHead>
					) : null}
					<TableBody>
						{this.state.tableData.map((prop, rowKey) => {
							return (
								<TableRow style={confidential[rowKey] ? { backgroundColor: "#ff6961" } : {}} key={rowKey}>
									{prop.map((prop, key) => {
										return (
											<TableCell style={confidential[rowKey] ? { color: "white" } : {}} className={classes.tableCell} key={key}>
												{prop}
											</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		);
	}
}

CustomTable.defaultProps = {
	tableHeaderColor: "gray"
};

CustomTable.propTypes = {
	classes: PropTypes.object.isRequired,
	tableHeaderColor: PropTypes.oneOf([
		"warning",
		"primary",
		"danger",
		"success",
		"info",
		"rose",
		"gray"
	]),
	tableHead: PropTypes.arrayOf(PropTypes.string),
	tableData: PropTypes.arrayOf(PropTypes.array)
};

export default withStyles(tableStyle)(CustomTable);
